cp -r ../troica/msa-spring-boot ./
cp -r ../msa-provisioning ./
cp -r ../troica/msa-frontend ./

rm -rf ./msa-spring-boot/.git
rm -rf ./msa-provisioning/.git
rm -rf ./msa-frontend/.git

git add .
git commit -m "."
git push