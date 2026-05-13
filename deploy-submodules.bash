#!/opt/homebrew/bin/bash

declare -A MODULES
MODULES=(
    ["ktcloud-msa-inventory-service"]="common client-redis inventory-service inventory inventory-event"
    ["ktcloud-msa-user-api-gateway"]="user-api-gateway"
    ["ktcloud-msa-order-service"]="common order-service order"
    ["ktcloud-msa-product-service"]="common product-service product"
    ["ktcloud-msa-auth-service"]="common user auth auth-service"
)

COMMON_FILES=("gradlew" "gradlew.bat" "gradle" "build.gradle.kts" ".gitignore")

GH_USER="kanei0415"

OUTPUT_DIR="./ktcloud-msa-services"

mkdir -p "$OUTPUT_DIR"

for REPO in "${!MODULES[@]}"; do
    SUBMODULE_LIST=(${MODULES[$REPO]})

    WORK_PATH="$OUTPUT_DIR/$REPO"

    mkdir -p "$WORK_PATH"

    for FILE in "${COMMON_FILES[@]}"; do
        if [ -e "./msa-spring-boot/$FILE" ]; then
            rm -rf "$WORK_PATH/$FILE" && cp -R "./msa-spring-boot/$FILE" "$WORK_PATH/"
        fi
    done

    for SUBMODULE in "${SUBMODULE_LIST[@]}"; do
        if [ -d "./msa-spring-boot/$SUBMODULE" ]; then
            rm -rf "$WORK_PATH/$SUBMODULE" && cp -R "./msa-spring-boot/$SUBMODULE" "$WORK_PATH/"
        fi
    done

    cd "$WORK_PATH" || exit

    git init
    git add .
    git commit -m "Split modules [${SUBMODULE_LIST[*]}] to $REPO"

    if ! gh repo view "ktcloud-msa/$REPO" >/dev/null 2>&1; then
        gh repo create "ktcloud-msa/$REPO" --public --source=. --remote=origin --push
    else
        if ! git remote | grep origin > /dev/null; then
            git remote add origin "https://github.com/ktcloud-msa/$REPO.git"
        fi
        git branch -M main
        git push -u origin main --force
    fi

    cd - > /dev/null
done