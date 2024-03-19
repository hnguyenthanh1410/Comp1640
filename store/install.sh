for d in ../modules/*/;
	do
		baseUrl=${pwb};
		echo ${baseUrl};
		echo \"Installing stuff on ${d:(11)}\";
		npm --prefix ${d} run install;
done;
