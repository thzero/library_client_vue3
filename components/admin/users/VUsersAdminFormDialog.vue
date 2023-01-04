<script>
import GlobalUtility from '@thzero/library_client/utility/global';

import VAdminFormDialog from '@/library_vue_vuetify/components/admin/VAdminFormDialog';
import VSelectWithValidation from '@/library_vue_vuetify/components/form/VSelectWithValidation';
import VTextFieldWithValidation from '@/library_vue_vuetify/components/form/VTextFieldWithValidation';

export default {
	name: 'VUsersAdminFormDialog',
	components: {
		VAdminFormDialog,
		VSelectWithValidation,
		VTextFieldWithValidation
	},
	extends: VAdminFormDialog,
	computed: {
		id() {
			return this.innerValue ? this.innerValue.id : '';
		},
		externalId() {
			return this.innerValue && this.innerValue.external ? this.innerValue.external.id : '';
		},
		name() {
			return this.innerValue && this.innerValue.external ? this.innerValue.external.name : '';
		},
		roles() {
			const roles = [];
			for (const prop of this.getRoles())
				roles.push(prop);
			return roles;
		}
	},
	methods: {
		getRoles() {
			return {};
		},
		async preComplete(correlationId) {
			const item = {
				id: this.innerValue.id,
				roles: this.innerValue.roles,
				updatedTimestamp: this.innerValue.updatedTimestamp
			};
			const response = await GlobalUtility.$store.dispatcher.adminUsers.updateAdminUser(correlationId, item);
			this.logger.debug('VUsersAdminFormDialog', 'preComplete', 'response', response, correlationId);
			return response;
		}
	}
};
</script>
