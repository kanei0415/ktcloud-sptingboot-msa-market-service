# 技術監査レポート — market-msa-app

**監査対象**: `market-msa-app/` (React 19 + Vite + TanStack Router/Query + MUI v9 + Zustand)
**監査観点**: モダンReactアーキテクチャ (2025–2026年時点のベストプラクティス)
**監査日**: 2026-05-13

---

## 0. エグゼクティブサマリー

本プロジェクトは **「層分けされた構造」** と **「Container/Presentationalパターン」** を一貫して適用しようとする意図が見える点で評価できる。一方で、**致命的なバグ**(タイポによるパスエイリアス破壊、ステート直接ミューテーション、`useMemo` の依存配列ミス、未使用引数による状態未更新)、**フックの命名規約違反による Rules of Hooks の検証不可**、**ローカルストレージと Zustand の二重化による真実の源泉(SoT)の喪失**、**TanStack Router/Query の機能を活用しきれていない冗長なコンテナ層**など、モダン React の観点では複数の重大な改善点を抱えている。

総合評価:
| 観点 | 評価 | コメント |
|---|---|---|
| アーキテクチャ意図 | B | 層化と責務分離の方針は明確 |
| 実装品質 | D | 状態の直接ミューテーション、依存配列ミス、未使用引数バグ等 |
| 型安全性 | C | TS導入済みだが `as any` が散在し、tuple型の濫用あり |
| 状態管理 | D | Zustand と localStorage が二重化し SoT が崩壊 |
| サーバー状態 (TanStack Query) | C | 採用は適切だが `isPending`/`error` 未活用 |
| ルーティング (TanStack Router) | C | File-based 採用は適切だが型安全 search/loader 未活用 |
| UI ライブラリ統合 | C | MUI と Tailwind の二重採用、`sx` インライン濫用 |
| セキュリティ | D | トークンを localStorage に保管、ログにヘッダ垂れ流し |
| テスト | F | 一切存在しない |
| CI/品質ゲート | F | 設定なし、lint も任意 |

---

## 1. プロジェクト構成の概観

```
market-msa-app/
├── src/
│   ├── routes/              # TanStack Router file-based routes
│   ├── routeTree.gen.ts     # 自動生成 (コミット済み)
│   ├── components/<Feature>/
│   │   ├── <Feature>.tsx              # Presentational
│   │   └── containers/<Feature>Container.tsx  # Container
│   ├── services/rest-api/   # TanStack Query フック層
│   ├── libs/rest-api/<domain>/  # axios トランスポート層
│   ├── store/               # Zustand
│   ├── hooks/               # localStorage 同期ラッパー
│   ├── typedef/             # ドメイン型
│   └── providers/TanStackProvider.tsx  # ルートプロバイダ
```

層は以下の順で連鎖する:

```
routes → containers → services (TanStack Query) → libs/rest-api (axios) → API Gateway
                ↓
            components (presentational)
```

**良い点**:
- 責務分離の意図が明確で、ファイル配置のルールが一貫している。
- ドメイン (`auth`, `order`, `product`, `inventory`) ごとに `request.ts` / `response.ts` / `<domain>-rest-api.ts` を分離している。

**問題点**:
- 後述するが、この層化が **すべての CRUD 機能に対して 4ファイル以上の追加** を要求するため、機能数の増加に対して急速に冗長化する。
- TanStack Router の `loader` を使えば不要になる Container 層が、実質「`useQuery → useMemo → 子コンポーネントへ pass-through」の定型句にしかなっていない。

---

## 2. 致命的なバグ (即座の修正が必要)

### 2.1 `@hooks/*` パスエイリアスのタイポ

**ファイル**: `tsconfig.app.json:28-30`

```json
"@hooks/*": [
  "./src/sthooksore/*"   // ← 明らかなタイポ。正しくは "./src/hooks/*"
],
```

実際のコードでは `import useToken from "../../hooks/useToken"` (`auth-service.ts:5`) のように **相対パスでバイパスして使っている** ため動いてしまっているが、エイリアスを意図通りに使い始めた瞬間に解決失敗する。エディタのインテリセンスも崩壊する。

**影響度**: 中 (動いているように見えて、誰かが `@hooks/...` 記法を使った瞬間に壊れる)
**修正**: `"./src/hooks/*"` に修正する。

---

### 2.2 `SignUpContainer` で名前が永遠に更新されない

**ファイル**: `src/components/SignUp/containers/SignUpContainer.tsx:25-27`

```ts
const onNameChanged = useCallback((newName: string) => {
  setName(name)   // ← bug: newName を渡すべき
}, [])
```

入力された名前ではなく **常に旧 state の `name`** をセットしている。さらに `useCallback` の依存配列に `name` が無いため、初期値 `''` が固定でセットされ続ける。**会員登録 API には常に空文字の name が送信される。**

**影響度**: 高 (機能不全)

---

### 2.3 `OrderCreateContainer` のステート直接ミューテーション

**ファイル**: `src/components/OrderCreate/containers/OrderCreateContainer.tsx`

```ts
// L58-64: removeProductInventoryItem
setSelectedOrderItem(prev => {
  const index = prev.findIndex(([p, i]) => i.id === inventory.id && p.id === product.id)
  return prev.splice(index, 1)   // ← 二重バグ
})
```

問題:
1. `Array.prototype.splice` は **元の配列を破壊的に変更** する。React の immutable 原則に違反。
2. `splice` の **戻り値は削除された要素の配列** であり、残った配列ではない。つまり「1要素を削除」したつもりが、ステートには「削除された 1 要素のみ」が残る。

```ts
// L66-74: updateProductInventoryItemQuantity
setSelectedOrderItem(prev => {
  const index = prev.findIndex(([p, i]) => i.id === inventory.id && p.id === product.id)
  prev[index][2] += updateQuantity   // ← prev を直接ミューテーション
  return [...prev]                   // ← shallow copy では tuple 内の数量変更は検知されない
})
```

問題:
1. `prev` および内部の tuple を破壊的に変更している。
2. shallow copy `[...prev]` では tuple 自体の参照は同じ (`prev[index] === [...prev][index]`)、`React.memo` 化したコンポーネントや `useMemo` の依存比較で更新が検知されない可能性。

**正しい実装例**:
```ts
setSelectedOrderItem(prev =>
  prev.map(([p, i, q]) =>
    p.id === product.id && i.id === inventory.id
      ? [p, i, q + updateQuantity]
      : [p, i, q]
  )
)
```

**影響度**: 高 (注文作成機能の根幹に位置するロジック)

---

### 2.4 `ProductContainer` の `useMemo` 依存配列が空

**ファイル**: `src/components/Product/containers/ProductContainer.tsx:8`

```ts
const products = useMemo(() => data ? data.products : [], [])
//                                                       ^^ 空
```

`data` が後から fetch されて変わっても、`products` は初回の計算結果 (`[]`) のまま。**商品一覧が永遠に空表示される。**

`OrderContainer` (`OrderContainer.tsx:8`) と `InventoryContainer` (`InventoryContainer.tsx:8`) は依存配列が `[data]` で正しい。**Product だけ依存配列が落ちている**ので、コピペ時のミスと推察される。

**影響度**: 高 (機能不全)

---

### 2.5 `OrderDetailContainer` が壊れている

**ファイル**: `src/components/OrderDetail/containers/OrderDetailContainer.tsx`

```ts
import Order from "@components/Order/Order"

const OrderDetailContainer = () => {
  return <Order />   // Order は orders: Order[] を required で要求
}
```

`Order` (実体は `OrderList`) は必須プロパティ `orders` を要求するが、未渡し。TypeScript エラーになるはずだが、`tsc -b` を build スクリプトで通している以上、`noEmit` 設定下でも型エラーが出るはずで、整合が疑わしい。

**`OrderDetail.tsx`** に至っては:
```ts
const OrderDetail = () => {
  return <div>OrderDetail</div>
}
```
プレースホルダーのまま放置されている。

**影響度**: 高 (注文詳細機能が未実装)

---

### 2.6 コンポーネント名のタイポ

- `LoginConatiner` (`LoginContainer.tsx:5`)  ※"Conatiner" → "Container"
- `OrderListItem` (`OrderType.ts`) と `OrderLineItem` (API スキーマ)の命名揺れ
- `OrderService` 内の `createOrder` だけ `use` プレフィックスがない

---

## 3. React フックの規約違反

### 3.1 サービス層のフックが Rules of Hooks を回避している

**ファイル**: `src/services/rest-api/order-service.ts`, `inventory-service.ts`, `product-service.ts`

```ts
const fetchAllOrders = () => {
  return useQuery({ queryKey: ['orders'], queryFn: OrderRestApi.fetchAll })
}

const OrderService = { fetchAllOrders, fetchOrder, createOrder }
export default OrderService
```

呼び出し側:
```ts
const { data } = OrderService.fetchAllOrders()
```

**問題**:
1. **`use` プレフィックスがない**。React/ESLint の `eslint-plugin-react-hooks` は名前で hook を識別するため、**Rules of Hooks の検査が完全に無効化される**。条件分岐やループ内で誤って呼び出しても警告されない。
2. オブジェクトのプロパティとして export されているため、静的解析が hook と認識する余地がさらに減る。
3. `auth-service.ts` だけは `useSignIn`/`useSignUp` と命名されているが、`order-service.ts`/`inventory-service.ts`/`product-service.ts` は `fetchAll*`/`useFetchAll*` と **命名規約が一貫していない**。

**改善方針**:
```ts
// 推奨: モジュールトップレベルで named export
export function useOrders() { ... }
export function useOrder(id: string) { ... }
export function useCreateOrder() { ... }
```

`Service` という擬似 namespace に押し込めるのは Java/Kotlin の DDD 慣習を引きずったもので、React においては **named hook export** が推奨パターン。

**影響度**: 高 (将来の不具合を検出する safety net が無効化されている)

---

### 3.2 `useEffect` の依存配列に `setToken` / `setUser` を含めていない

**ファイル**: `src/hooks/useToken.ts`, `src/hooks/useUser.ts`

```ts
const updateToken = useCallback((token: Token) => {
  setToken(token)
  setStorageData('LOCAL', STORAGE_KEYS.token, JSON.stringify(token))
}, [])   // ← setToken を依存に入れていない
```

Zustand の setter は安定参照なので **動作上は問題ない** が、`react-hooks/exhaustive-deps` ルールに反する。さらに `flushToken` も同様。コードレビューで意図が伝わらない。

```ts
useEffect(() => {
  if (token) setStorageData('LOCAL', STORAGE_KEYS.token, JSON.stringify(token))
}, [token])
```

これは **下記 3.3 と組み合わさって二重書き込み** を引き起こす。

---

### 3.3 ストレージ同期の二重化 (Single Source of Truth 違反)

**ファイル**: `src/hooks/useToken.ts`, `useUser.ts`

```ts
// updateToken: ① set Zustand, ② localStorage 書き込み
const updateToken = useCallback((token: Token) => {
  setToken(token)
  setStorageData(...)   // ← ①
}, [])

// useEffect: token 変化を検知 → localStorage 書き込み
useEffect(() => {
  if (token) setStorageData(...)   // ← ②
}, [token])
```

`updateToken()` が呼ばれると、`setToken` → state 更新 → re-render → `useEffect` が `token` 変化を検知 → ① と同じ書き込みをもう一度行う。**毎回 2 回 localStorage に書き込んでいる**。

さらに:
```ts
// マウント時: localStorage → Zustand へ復元
useEffect(() => {
  const saved = getStorageData('LOCAL', STORAGE_KEYS.token)
  const token = saved ? JSON.parse(saved) as Token : null
  if (token) setToken(token)
  else setToken(null)   // ← null だった場合も明示的に null をセット
}, [])
```

`useToken()` を呼んでいるコンポーネントが複数あれば、**マウントごとに復元処理が走る**。これは `flushToken()` 直後に `useToken()` を呼ぶ別コンポーネントがマウントされると、**既に削除したはずのトークンが戻ってくる** などの競合を招く。

**さらに悪いことに、axios インターセプタは Zustand を経由せず localStorage を直接読みに行く**:

**ファイル**: `src/libs/rest-api/rest-config.ts:14`
```ts
api.interceptors.request.use((config) => {
  const saved = getStorageData('LOCAL', STORAGE_KEYS.token)
  // ...
})
```

**3つの真実の源泉**:
1. Zustand store (`useTokenStore`)
2. localStorage
3. axios の per-request 読み取り

これらの間で同期が崩れた瞬間、認証状態が不整合になる。

**改善方針**:
```ts
// Zustand persist middleware を使用して一元化
import { persist } from 'zustand/middleware'

export const useTokenStore = create(
  persist<TokenState>(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: '@TOKEN_KEY' }
  )
)
```

axios インターセプタは:
```ts
api.interceptors.request.use((config) => {
  const token = useTokenStore.getState().token   // 単一のSoT
  if (token) config.headers.Authorization = `Bearer ${token.accessToken}`
  return config
})
```

カスタムフック `useToken` / `useUser` 自体が**不要になる**。

**影響度**: 高 (認証状態の信頼性に直結)

---

## 4. TanStack Query の活用不足

### 4.1 `isPending` / `error` を一切扱っていない

**ファイル**: 全 Container

```ts
const { data } = OrderService.fetchAllOrders()
const orders = useMemo(() => data ? data.orders : [], [data])
return <Order orders={orders} />
```

- ローディング中 (data === undefined) と「APIが空配列を返した」を区別できない。
- ネットワークエラー時に空表示になり、ユーザーは原因が分からない。
- `error` を一切ハンドリングしていない。

**改善方針**:
```ts
const { data, isPending, error } = useOrders()
if (isPending) return <Skeleton />
if (error) return <ErrorState error={error} />
return <Order orders={data.orders} />
```

または React 19 の Suspense + `useSuspenseQuery` を採用すれば、ロード状態をルートで宣言できる。

---

### 4.2 `QueryClient` のデフォルト設定が未指定

**ファイル**: `src/providers/TanStackProvider.tsx:14`

```ts
const queryClient = new QueryClient()
```

- `staleTime: 0` (デフォルト) のため、再マウントするたびに re-fetch が走る。
- リトライ・キャッシュ時間・refetchOnWindowFocus 等の戦略が未定義。

**改善方針**:
```ts
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

---

### 4.3 `queryKey` 戦略が脆弱

```ts
queryKey: ['orders']
queryKey: ['order', id]
queryKey: ['inventories']
queryKey: ['inventory', id]
queryKey: ['products']
queryKey: ['product', id]
queryKey: ['token', 'user']   // ← auth-service.ts:19, 意味不明
```

`auth-service.ts:19` の `invalidateQueries({ queryKey: ['token', 'user'] })` は何にもマッチしない (実際にそのキーで登録された query が存在しない)。多分意図は「token と user に関連するキャッシュをすべて無効化したい」だが、それは:
```ts
queryClient.invalidateQueries()   // 全クエリを invalidate
```
あるいは個別に:
```ts
queryClient.invalidateQueries({ queryKey: ['orders'] })
queryClient.invalidateQueries({ queryKey: ['products'] })
```
が必要。

**改善方針**: `queryKey` を構造化された関数として一元管理する (TanStack 公式推奨パターン):
```ts
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
}
```

---

### 4.4 mutation 後の navigation を service に置いていることの是非

**ファイル**: `src/services/rest-api/order-service.ts:24-29`

```ts
const createOrder = () => {
  const navigate = useNavigate();
  return useMutation({
    onSuccess: (response) => {
      navigate({ to: ROUTE_PATHS.orderDetail, search: { id: response.order.id } } as any)
    }
  })
}
```

「サービス層」が画面遷移を抱えるのは責務が混線している。ナビゲーションは UI の関心事であり、Container 側の `onSuccess` で行うべき。`useMutation` の `onSuccess` はオプションでオーバーライド可能なので:

```ts
// service: 純粋なミューテーション
export function useCreateOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: OrderRestApi.createOrder,
    onSuccess: (res) => queryClient.invalidateQueries({ queryKey: orderKeys.detail(res.order.id) }),
  })
}

// container: ナビゲーションを宣言
const { mutate } = useCreateOrder()
const navigate = useNavigate()
const onSubmit = () => mutate(req, { onSuccess: (res) => navigate({ to: '/order-detail', search: { id: res.order.id } }) })
```

これにより、サービスを別の画面 (例: モーダル) から再利用しても遷移が固定されない。

---

## 5. TanStack Router の活用不足

### 5.1 `loader` を使えば Container はほぼ不要

TanStack Router は **route-level loader** で TanStack Query と統合できる。これを使えば:

```ts
// routes/orders.tsx
export const Route = createFileRoute('/orders')({
  loader: ({ context }) => context.queryClient.ensureQueryData(orderQuery()),
  component: OrdersPage,
})

function OrdersPage() {
  const { data } = useSuspenseQuery(orderQuery())
  return <OrderList orders={data.orders} />
}
```

**メリット**:
- Container が消える (`OrderContainer.tsx` 不要)
- 画面遷移時にローダーが先行実行されるため UX が滑らか
- Suspense と統合され `isPending` 分岐が消える
- `useMemo(() => data ? data.x : [], [data])` という防衛的フォールバックが不要 (Suspense が解決を保証)

現状はこの仕組みを一切使っておらず、Container が「`useQuery` を呼んで pass-through するだけ」の **空虚な層** になっている。

---

### 5.2 型安全な navigation を放棄している

**ファイル**: `src/services/rest-api/order-service.ts:24`, `auth-service.ts:26,37`

```ts
navigate({ to: ROUTE_PATHS.orderDetail, search: { id: response.order.id } } as any)
//                                                                          ^^^^^^^
```

TanStack Router の最大の強みは **すべてのルートが型推論される** ことだが、`as any` で型を捨てている。`order-detail` ルートが `search: { id: string }` を validation していないため、search params の整合性を検査できていない。

**改善方針**:
```ts
// routes/order-detail.tsx
export const Route = createFileRoute('/order-detail')({
  validateSearch: (search) => ({ id: String(search.id) }),
  component: OrderDetailPage,
})
```

これだけで `as any` が不要になり、URL のパラメータ仕様がコード化される。

---

### 5.3 認証ガード (protected route) が無い

`/orders`, `/products`, `/inventories`, `/order-create` は **未認証でもアクセスできる**。

TanStack Router の正しい解決策は **layout route での `beforeLoad`**:

```ts
// routes/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) throw redirect({ to: '/sign-in' })
  },
})
```

そして `/orders` を `routes/_authenticated/orders.tsx` に移動するだけで、保護される。

---

### 5.4 ルートエレメントがレイアウトを抱えている

**ファイル**: `src/routes/__root.tsx`

```tsx
component: () => (
  <>
    <SideBar />
    <Outlet />
    <TanStackRouterDevtools />
  </>
)
```

`SideBar` がランディングページ (`/`) やサインイン画面 (`/sign-in`) でも表示されてしまう。`Landing.tsx` を見るとサイドバーを想定しないフルスクリーン構成。**実際の表示でサイドバーがランディングのデザインに被さる。**

レイアウト分離は TanStack Router の Layout Routes (Pathless Routes) で行うべき:
```
routes/
├── __root.tsx                 # 共通プロバイダのみ
├── (public)/
│   ├── _layout.tsx            # 公開用レイアウト
│   ├── _layout.index.tsx      # /
│   └── _layout.sign-in.tsx
└── _app/
    ├── _layout.tsx            # SideBar を含む
    ├── _layout.orders.tsx
    └── _layout.products.tsx
```

---

## 6. コンポーネント設計

### 6.1 Container/Presentational パターンの硬直化

すべての画面で:
1. `routes/<x>.tsx` (route 定義)
2. `components/<X>/containers/<X>Container.tsx` (フック呼び出し)
3. `components/<X>/<X>.tsx` (Presentational)
4. `services/rest-api/<x>-service.ts`

の **4 ファイル一組** を作っている。これは2018年頃に Dan Abramov が提唱した Container/Presentational が **後に著者自身に「過剰な分割を生むので推奨を撤回する」と表明された** パターン。

モダン React では:
- カスタムフックでロジックを抽出
- コンポーネントは「ロジックを保持しても良い」が、**1ファイルに収まる範囲**で
- TanStack Router の loader / Server Components / Suspense を使えば「データ取得とレンダリングを分離するための Container」自体が不要

現状、`OrderContainer.tsx` が:
```ts
const OrderContainer = () => {
  const { data } = OrderService.fetchAllOrders()
  const orders = useMemo(() => data ? data.orders : [], [data])
  return <Order orders={orders} />
}
```
これに **専用ディレクトリと専用ファイル** を割いている。プレゼンテーション側に直接フックを書くか、route loader で先行取得すれば、この層は完全に消せる。

---

### 6.2 `useMemo` の過剰使用

```ts
const orders = useMemo(() => data ? data.orders : [], [data])
const inventories = useMemo(() => inventoryResponseData ? inventoryResponseData.inventories : [], [inventoryResponseData])
```

`data?.orders ?? []` は **計算コスト 0** であり、`useMemo` で包む価値がない。`useMemo` のオーバーヘッド (依存配列比較・参照保持) の方が高い。

`OrderCreateContainer.tsx:24` の `productInventoriesInfo` は filter を含むので useMemo が妥当だが、それ以外は **削除すべき**。

逆に `useCallback` の依存配列を見ると、たとえば `OrderCreateContainer.tsx:46` で `[orderListRequest]` を指定しているが、`orderListRequest` 自体が `selectedOrderItem` 由来なので、結局毎回再生成される。**このコンポーネントは React.memo で子を包んでいないので useCallback の意味が無い**。

---

### 6.3 MUI の `sx` インライン濫用

例: `Order.tsx` の 1 ファイル中に `sx={{ ... }}` が 19 箇所、ハードコードされた hex (`#102a43`, `#38bdf8`, `#0ea5e9`, `#f8fafc` 等) が 30 箇所以上。

**問題**:
1. デザイントークン (theme palette) を使っていない。色を変更する際、全ファイルを grep して置換する必要。
2. 同じスタイルが Order/Inventory/Product/Login/SignUp/Landing で重複。
3. `<Box sx={{ p: 3, bgcolor: '#f8fafc', minHeight: '100vh' }}>` のようなページ全体のレイアウトを各コンポーネント内に閉じ込めている。**レイアウトはルートまたは layout route の責務。**

**改善方針**:
- `ThemeProvider` と `createTheme` で palette/typography を定義 (現状未設定)
- 画面共通の余白・背景はレイアウトコンポーネントに引き上げる
- 繰り返すスタイルは `styled()` か `sx` の関数化で抽象化

---

### 6.4 MUI と Tailwind の二重採用

`package.json`:
```
"@mui/material": "^9.0.1",
"@tailwindcss/vite": "^4.3.0",
"tailwindcss": "^4.3.0"
```

しかし `index.css` を除くと **Tailwind のクラスは1つも使われていない**。MUI の `sx` で全てやっているため、Tailwind は CSS バンドルを増やすだけのデッドウェイト。

**判断**: どちらかに統一する。MUI を主軸にするなら Tailwind 削除。Tailwind を主軸にするなら MUI を捨てて shadcn/ui や Radix + Tailwind に切り替え。

**現状**: 両方入れて MUI のみ使用 = バンドルサイズと依存関係の両方を悪化させている。

---

### 6.5 同名インポートとの混乱

```ts
// Order.tsx
import type { Order } from "@typedef/OrderType";
const OrderList = ({ orders }: Props) => { ... }
export default OrderList;
```

ファイル名は `Order.tsx`、コンポーネント名は `OrderList`、型名は `Order`、ディレクトリ名は `Order`。**4種類の名前** が混在。
- `OrderDetailContainer.tsx` は `import Order from "@components/Order/Order"` だが、これが `OrderList` だと一目でわからない。

**統一**: ファイル名・default export 名・ディレクトリ名は揃える。

---

### 6.6 `forwardRef`/`memo`/`Suspense` の不在

- `React.memo` を使っているコンポーネントが **0 個**。
- `Suspense` 境界が **0 個**。
- `ErrorBoundary` が **0 個** (TanStack Query の `QueryErrorResetBoundary` も未使用)。

React 19 では Compiler の自動メモ化が普及し始めている (`babel-plugin-react-compiler`)。これを導入すれば `useCallback`/`useMemo`/`React.memo` の手動最適化を大幅に削減できる。**現状は未導入**。

---

## 7. 型安全性

### 7.1 `as any` の散在

| 箇所 | 内容 |
|---|---|
| `auth-service.ts:26, 37` | `navigate({ ... } as any)` |
| `order-service.ts:29` | 同上 |
| `Order.tsx:83` | `<Chip color={orderStatus.color as any} />` |
| `Inventory.tsx:83` | `<LinearProgress color={status.color as any} />` |

navigate の `as any` は §5.2 で対処可能。Chip の color は MUI の `'success' | 'warning' | 'info' | 'default'` などのリテラル合併型にすべき:

```ts
const getStatusColor = (status: string): { color: ChipProps['color']; label: string } => {
  switch (status.toLowerCase()) { ... }
}
```

---

### 7.2 Tuple型による不透明なデータ構造

**ファイル**: `OrderCreateContainer.tsx`

```ts
useState<[Product, Inventory, number][]>([])
selectedOrderItem.find(([_, inv]) => inv.id === inventoryId)
selectedOrderItem.map(([p, i, q]) => ({ ... }))
prev[index][2] += updateQuantity   // ← "2" が何かはコメントを読むしかない
```

`[2]` が「数量」だと知るには定義を見に行く必要がある。**意味を持たない位置インデックスでフィールドにアクセス**するのは可読性・保守性に難がある。

**改善**:
```ts
type SelectedOrderItem = {
  product: Product
  inventory: Inventory
  quantity: number
}
useState<SelectedOrderItem[]>([])
```

---

### 7.3 インターフェースのプロパティ名がクォートされている

```ts
export interface Inventory {
  "id": number,
  "productId": string,
  "skuCode": string,
  "quantity": number
}
```

JSON Schema や OpenAPI から自動生成したかのような書き方だが、**手書きしている割にクォートが付いている**。TypeScript としては合法だが、慣習的ではなく、grep しづらい (例: `id:` で検索できない)。クォートを外すべき。

---

### 7.4 `verbatimModuleSyntax` を有効にしているが活かしきれていない

`tsconfig.app.json` で `"verbatimModuleSyntax": true` を有効化している (= type-only import を強制)。これは正しく機能しており、`import type { ... }` が使われているのは確認できた。一貫している点で評価。

---

### 7.5 OpenAPI スキーマからの型自動生成が無い

バックエンドが MSA (おそらく OpenAPI/Swagger を提供) なら、`openapi-typescript` や `orval` で `request.ts`/`response.ts` を **自動生成**すべき。手書きのため、バックエンドとのスキーマ齟齬が型レベルで検知できない。

---

## 8. 状態管理

### 8.1 Zustand の使い方が薄い

```ts
export const useTokenStore = create<TokenState>((setTokenFromStore) => ({
  token: null,
  setToken: (token) => setTokenFromStore({ token: token })
}))
```

これは Zustand を使う **意義がほぼない最小構成**。`useState` をルートに上げるかコンテキストに置くのと変わらない。
- `persist` middleware を使えば §3.3 のストレージ二重化問題が消える
- セレクタ機能 (`useTokenStore(s => s.token)`) を使っていないため不要な re-render が発生し得る

---

### 8.2 セレクタ未使用による subscribe 過多

```ts
const { token, setToken } = useTokenStore()
```

これは store のすべてのフィールドを購読する。Zustand の慣用は:
```ts
const token = useTokenStore(s => s.token)
const setToken = useTokenStore(s => s.setToken)
```
であり、`token` の変更でのみ再レンダーされる。

---

### 8.3 フォーム state を生 useState で管理している

`LoginContainer`, `SignUpContainer` で `email`/`password`/`name` をすべて個別の `useState` + `onChange` ハンドラで管理。

- バリデーション無し
- エラー表示無し
- React 19 の `useActionState` / `useFormStatus` が使える状況なのに未使用
- `react-hook-form` + `zod` といった標準的な選択肢を採用していない

ログイン・登録という **ビジネスクリティカルなフォームに対してまったく堅牢性がない**。

---

## 9. エラーハンドリング & ロギング

### 9.1 axios インターセプタが本番でも `console.log` する

**ファイル**: `src/libs/rest-api/rest-config.ts:25, 38, 43`

```ts
console.log(config)    // request 全体 (Authorization ヘッダ含む) を出力
console.log(response)  // response 全体を出力
console.error(error)
```

**問題**:
1. **本番環境で認証ヘッダがコンソールに垂れ流される**。サードパーティスクリプトが console を読めば情報漏洩の経路になる。
2. プロダクションビルドで `console.log` を削除する設定が無い (Vite の `esbuild.drop` 等)。
3. ロギングは Sentry/Datadog 等の専用ツールに集約すべき。

---

### 9.2 401 (認証切れ) のハンドリングが無い

```ts
api.interceptors.response.use(
  (response) => response,
  async (error) => Promise.reject(error)
)
```

リフレッシュトークン (`refreshToken` フィールドは存在する) を使った再発行ロジックも、401 でログアウトに追い出す処理も無い。**トークンが切れた瞬間、全画面が無言で空表示になる**。

---

### 9.3 ユーザーフィードバックに `alert()`

**ファイル**: `auth-service.ts:38`

```ts
onSuccess: () => {
  navigate({ to: ROUTE_PATHS.signIn } as any)
  alert('로그인 해주세요')
}
```

`alert()` はモダン Web アプリでは使うべきでない (UX が悪い、テストしづらい、ブロッキング)。MUI に Snackbar が用意されている。

---

### 9.4 ErrorBoundary の不在

トップレベルにも、ルート単位にも、TanStack Query の `QueryErrorResetBoundary` も使われていない。**1 つの未捕捉例外でアプリ全体がホワイトスクリーン化する**。

---

## 10. セキュリティ

| 項目 | 現状 | リスク |
|---|---|---|
| トークン保管場所 | `localStorage` | **XSS 経由で盗取可能**。HttpOnly Cookie 推奨 |
| トークンの送信 | `Authorization: Bearer` | OK |
| 401 リフレッシュ | 実装無し | セッション切れ時 UX 破綻 |
| CSRF 対策 | 不要 (Bearer 方式) | OK |
| ログ出力 | 全 request/response を console | **認証ヘッダ漏洩** |
| パスワードバリデーション | クライアント側に無し | 弱パスワードを許容 |
| メールバリデーション | 無し | 不正値を送信 |
| ルートガード | 無し | 認証無しで全画面アクセス可能 |
| 環境変数 | `.env` を `.gitignore` に追加済 | OK |

---

## 11. ビルド & ツーリング

### 11.1 依存関係の整合性

`package.json` を見ると:
- `typescript: "~6.0.2"` → TypeScript 6 系 (現実世界では 5系が最新だが、本プロジェクトは 2026年想定なので妥当の可能性)
- `react: "^19.2.6"` → React 19 系
- `vite: "^8.0.12"` → Vite 8
- `@mui/material: "^9.0.1"` → MUI v9
- `eslint: "^10.3.0"` → ESLint 10

メジャー版が比較的新しく揃っており、技術選択自体は新しい部類。一方で:
- **`prettier` が無い** → コードスタイル統一が ESLint のみに依存
- **`husky` / `lint-staged` が無い** → コミット時の品質ゲートが無い
- **CI 設定 (`.github/workflows/` 等) が無い** → 統合検証が手動
- **テストランナーが無い** → Vitest / Playwright / Testing Library など完全不在

---

### 11.2 ビルドスクリプト

```json
"dev": "npx @tanstack/router-cli generate && vite",
"build": "npx @tanstack/router-cli generate && tsc -b && vite build"
```

- `npx` を毎回打つのは起動時間にペナルティ。`@tanstack/router-plugin/vite` を `vite.config.ts` で有効化済 (実際に有効) なので、**手動 generate は冗長**。`vite dev` の起動時に router-plugin が自動で生成する。
- `tsc -b` を build に挟んでいるのは型チェックを通すためで、これは適切。

---

### 11.3 `.tanstack/` ディレクトリがコミットされている

`.gitignore` に `.tanstack` が無いため、ローカルキャッシュが Git 管理下に入っている可能性。確認して `.gitignore` 追加すべき。

---

### 11.4 `routeTree.gen.ts` がコミットされている

これは TanStack Router の慣習として **コミットすべき** とされているので問題なし。ただし `dev` 起動のたびに上書きされるので、PR レビューでノイズになる可能性。CI で `--check` モードを走らせるのが望ましい。

---

## 12. テスト

**テストファイル数: 0**

- ユニットテスト: 無し (Vitest 未導入)
- コンポーネントテスト: 無し (React Testing Library 未導入)
- E2E: 無し (Playwright/Cypress 未導入)
- 型テスト: 無し (`tsd` / `expect-type` 未導入)

最低限:
1. `useToken`/`useUser` のストレージ同期ロジック
2. `OrderCreateContainer` の選択ロジック (現状バグ満載なので尚更必要)
3. axios インターセプタのトークン付与
4. 主要画面のスモークテスト (Playwright)

これらはテストの ROI が極めて高い。

---

## 13. 国際化 (i18n)

UI 文字列はすべてハードコーディングされた韓国語 + 一部の英語混在。`react-i18next` 等の i18n ライブラリは未導入。プロジェクト名が "MSA" でグローバルなトーンを目指すなら早期に導入を検討すべき。

---

## 14. アクセシビリティ (a11y)

- `<Box component={Link} ...>` が button 内に button (`Button variant="text"`) を入れている (`Login.tsx:72-76`, `SignUp.tsx:120-127`) → HTML として不正
- フォーム要素に `<form>` タグが無い → Enter キーで送信できない
- アイコンボタン (`IconButton`) に `aria-label` を付けていない (`Inventory.tsx:104, 109`)
- 色コントラスト未検証

---

## 15. 推奨アクションリスト (優先度順)

### P0 (即時対応)

1. `tsconfig.app.json` の `@hooks/*` パスエイリアスのタイポ修正 (§2.1)
2. `SignUpContainer.tsx:27` の `setName(name)` → `setName(newName)` 修正 (§2.2)
3. `OrderCreateContainer.tsx:62` の `splice` 破壊的変更を `filter` ベースに修正 (§2.3)
4. `OrderCreateContainer.tsx:70` の直接ミューテーション修正 (§2.3)
5. `ProductContainer.tsx:8` の `useMemo` 依存配列に `data` を追加 (§2.4)
6. `OrderDetailContainer.tsx` を実装する (§2.5)
7. axios インターセプタの `console.log` を本番では削除 (§9.1)

### P1 (1〜2スプリント以内)

8. Zustand `persist` middleware を導入してストレージ同期を一元化、`useToken`/`useUser` のラッパーを廃止 (§3.3, §8.1)
9. サービス層のフックを named export に変え、`use` プレフィックスを徹底 (§3.1)
10. ErrorBoundary をルートに設置 (§9.4, §6.6)
11. axios の 401 ハンドリングとリフレッシュトークン処理を実装 (§9.2)
12. 認証ガード (`_authenticated` layout route) を導入 (§5.3)
13. `QueryClient` のデフォルト設定を見直し (§4.2)
14. `react-hook-form` + `zod` でフォームを書き直し (§8.3)

### P2 (中期)

15. Container 層を route loader + `useSuspenseQuery` に置換 (§5.1, §6.1)
16. Tailwind を削除、または MUI を削除して片方に統一 (§6.4)
17. MUI Theme を定義してハードコード hex を排除 (§6.3)
18. レイアウトを Layout Route に分離 (§5.4, §6.3)
19. OpenAPI スキーマからの型自動生成を導入 (§7.5)
20. Vitest + React Testing Library + Playwright の最小セットアップ (§12)
21. `eslint-plugin-react-hooks` の警告に向き合う ESLint 設定強化 (§3.2)
22. Prettier + Husky + lint-staged + CI ワークフロー追加 (§11.1)

### P3 (継続改善)

23. Tuple ベースのデータを named object に置換 (§7.2)
24. Zustand セレクタの導入 (§8.2)
25. Suspense と `useSuspenseQuery` 併用で分岐を消す (§4.1)
26. React Compiler 導入による手動メモ化の削減 (§6.6)
27. i18n 導入 (§13)
28. a11y 監査 (§14)

---

## 16. 結論

**良い面**:
- React 19 / TanStack Router & Query / Vite / Zustand といった **モダンスタックを採用している点で土台は良い**。
- 層化と命名規則の意図は一貫しており、後から方針を立て直しやすい。

**悪い面**:
- 採用したライブラリの **「真の機能」を活用できていない** (TanStack Router の loader、Query の Suspense、Zustand の persist、TS の型推論)。
- バックエンドフレームワーク的な「Service / Container」の発想を React に持ち込んでいるが、それが React の宣言的・関数型な性質と衝突して **空虚な層** を生んでいる。
- **複数の致命的バグが本番経路に存在**しており、テストもないため、これらが検知されないまま積み上がるリスクが高い。

**最重要メッセージ**:
> 現状は「層を作りたかった人」が書いたコードであり、「React の流儀で書く人」のコードではない。
> P0 のバグ修正で出血を止めた後、P1 の SoT 一元化と認証フローを整備し、その上で **Container 層を loader に置き換える** 大規模リファクタを行うことで、ファイル数を半減させながら型安全性と UX を劇的に改善できる。

以上。
