<script>
import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import VAdminFormDialog from '@/library_vue_vuetify/components/admin/VAdminFormDialog';
import VCheckboxWithValidation from '@/library_vue_vuetify/components/form/VCheckboxWithValidation';
import VDateTimeFieldWithValidation from '@/library_vue_vuetify/components/form/VDateTimeFieldWithValidation';
import VMarkdownEditor from '@/library_vue_vuetify/components/markup/VMarkdownEditor';
import VSelectWithValidation from '@/library_vue_vuetify/components/form/VSelectWithValidation';
import VTextFieldWithValidation from '@/library_vue_vuetify/components/form/VTextFieldWithValidation';

export default {
	name: 'VNewsAdminFormDialog',
	components: {
		VAdminFormDialog,
		VCheckboxWithValidation,
		VDateTimeFieldWithValidation,
		VMarkdownEditor,
		VSelectWithValidation,
		VTextFieldWithValidation
	},
	extends: VAdminFormDialog,
	created() {
		this.serviceStore = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_STORE);
	},
	methods: {
		async preComplete(correlationId) {
			delete this.innerValue.updatedTimestamp;
			let response;
			if (this.innerValue.id)
				response = await this.serviceStore.dispatcher.adminNews.updateAdminNews(correlationId, this.innerValue);
			else
				response = await this.serviceStore.dispatcher.adminNews.createAdminNews(correlationId, this.innerValue);
			this.logger.debug('VNewsAdminFormDialog', 'preComplete', 'response', response, correlationId);
			return response;
		}
	}
};
</script>
