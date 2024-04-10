for dir in $(find ./modules -maxdepth 1 -mindepth 1 -type d); 
	do npm -prefix $dir install
done