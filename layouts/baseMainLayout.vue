<script>
import { getCurrentInstance, computed, ref } from 'vue';
import { useStore } from 'vuex';

import LibraryConstants from '@thzero/library_client/constants';

import GlobalUtility from '@thzero/library_client/utility/global';

import baseLayout from './baseLayout';

import DialogSupport from '@/library_vue/components/support/dialog';

const auth = GlobalUtility.$injector.getService(LibraryConstants.InjectorKeys.SERVICE_AUTH);

export default {
	name: 'BaseMainLayout',
	extends: baseLayout,
	setup() {
		const closeOnContentClick = ref(true);
		const dialogSignOut = ref(new DialogSupport());

		const store = useStore();

		const instance = getCurrentInstance();

		const isAuthCompleted = computed(() => {
			return store.state.user && store.state.user.authCompleted;
		});
		const isLoggedIn = computed(() => {
			return store.state.user && store.state.user.isLoggedIn;
		});

		const clickAbout = () => {
			GlobalUtility.$navRouter.push('/about');
		};
		const clickOpenSource = () => {
			GlobalUtility.$navRouter.push('/openSource');
		};
		const clickSignIn = () => {
			GlobalUtility.$navRouter.push('/auth');
		};
		const clickSignOut = async () => {
			dialogSignOut.value.ok();
			await auth.signOut(instance.ctx.correlationId());
		};
		const clickSupport = () => {
			GlobalUtility.$navRouter.push('/support');
		};
		const dialogSignOutOk = async () => {
			dialogSignOut.value.ok();
			await auth.signOut(instance.ctx.correlationId());
		};
		const toggleDrawer = async () => {
			GlobalUtility.$EventBus.emit('toggle-drawer');
		};

		return Object.assign(baseLayout.setup(), {
			closeOnContentClick,
			dialogSignOut,
			isAuthCompleted,
			isLoggedIn,
			clickAbout,
			clickOpenSource,
			clickSignIn,
			clickSignOut,
			clickSupport,
			dialogSignOutOk,
			toggleDrawer
		});
	}
	// data: () => ({
	// 	closeOnContentClick: true,
	// 	dialogSignOut: new DialogSupport()
	// }),
	// computed: {
	// 	isAuthCompleted() {
	// 		return this.$store.state.user && this.$store.state.user.authCompleted;
	// 	},
	// 	isLoggedIn() {
	// 		return this.$store.state.user && this.$store.state.user.isLoggedIn;
	// 	}
	// },
	// methods: {
	// 	clickAbout() {
	// 		GlobalUtility.$navRouter.push('/about');
	// 	},
	// 	clickOpenSource() {
	// 		GlobalUtility.$navRouter.push('/openSource');
	// 	},
	// 	async clickSignIn() {
	// 		GlobalUtility.$navRouter.push('/auth');
	// 	},
	// 	clickSupport() {
	// 		GlobalUtility.$navRouter.push('/support');
	// 	},
	// 	async dialogSignOutOk() {
	// 		this.dialogSignOut.ok();
	// 		await auth.signOut(this.correlationId());
	// 	},
	// 	toggleDrawer() {
	// 		GlobalUtility.$EventBus.emit('toggle-drawer');
	// 	}
	// }
};
</script>
