<script>
import baseListing from '@/library_vue/components/admin/baseListing';

import VConfirmationDialog from '@/library_vue_vuetify/components/VConfirmationDialog';

export default {
	name: 'VueBaseAdminList',
	components: {
		VConfirmationDialog
	},
	extends: baseListing,
};
</script>
