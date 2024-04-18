<template>
	<v-layout class="h-100" justify-center align-center>
		<index-card width="90vw" height="85vh">
			<submit-form :id="$route.params.id" />
		</index-card>
	</v-layout>
</template>
