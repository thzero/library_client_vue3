<template>
	<v-container pa-0>
		<v-row>
			<v-col
				cols="6"
				class="pa-0"
			>
				<VTextAreaWithValidation
					ref="markdownRef"
					v-model="innerValue"
					:vid="vid"
				/>
			</v-col>
			<v-col
				cols="6"
				class="pa-0"
			>
				<!-- eslint-disable vue/no-v-html -->
				<div
					class="markdown-body mt-3 ml-2"
					v-html="preview"
				/>
				<!--eslint-enable-->
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import baseMarkdownEditor from '@/library_vue/components/markup/baseMarkdownEditor';
import VTextAreaWithValidation from '../form/VTextAreaWithValidation';

export default {
	name: 'VtMarkdownEditor',
	components: {
		VTextAreaWithValidation
	},
	extends: baseMarkdownEditor
};
</script>

<style scoped>
</style>
