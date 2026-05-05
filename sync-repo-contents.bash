cp -r ../msa-spring-boot ./
cp -r ../msa-provisioning ./

rm -rf ./msa-spring-boot/.git
rm -rf ./msa-provisioning/.git

git add .
git commit -m "Sync contents from msa-spring-boot and msa-provisioning repositories"
git push origin master