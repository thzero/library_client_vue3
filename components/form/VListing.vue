<template>
	<div>
		<div
			v-for="(item, index) in value"
			:key="index"
			class="red--text text--lighten-1 v-messages"
		>
			{{ item }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'VListing',
	props: {
		// must be included in props
		value: {
			type: Array,
			default: () => []
		}
	}
};
</script>

<style scoped>
</style>
