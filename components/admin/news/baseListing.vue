<script>
import baseListing from '@/library_vue/components/admin/news/baseListing';

import VConfirmationDialog from '@/library_vue_vuetify/components/VConfirmationDialog';
import VMarkdown from '@/library_vue_vuetify/components/markup/VMarkdown';

export default {
	name: 'VueBaseAdminNewsListing',
	components: {
		VConfirmationDialog,
		VMarkdown
	},
	extends: baseListing
};
</script>
