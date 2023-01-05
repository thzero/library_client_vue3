<template>
	<v-container fluid>
		<v-row justify="center">
			<v-card>
				<v-card-text
					style="min-width: 300px;"
				>
					<v-container fluid>
						<v-row justify="center">
							<v-btn
								v-if="display"
								:disabled="disabled"
								color="primary"
								@click="signInGoogle"
							>
								{{ $t('auth.google') }}
							</v-btn>
						</v-row>
						<v-row justify="center">
							<v-switch
								v-if="allowRememberMe"
								v-model="rememberMe"
								:label="$t('auth.rememberMe')"
							/>
						</v-row>
					</v-container>
				</v-card-text>
			</v-card>
		</v-row>
	</v-container>
</template>

<script>
import { useBaseAuthComponent } from '@/library_vue/components/baseAuth';

export default {
	name: 'VtAuth',
	setup(props, context) {
		const {
			correlationId,
			error,
			hasFailed,
			hasSucceeded,
			initialize,
			logger,
			noBreakingSpaces,
			notImplementedError,
			success,
			allowRememberMe,
			authenticated,
			disabled,
			display,
			features,
			isLoggedIn,
			rememberMe,
			serviceAuth,
			signInGoogle
		} = useBaseAuthComponent(props, context);

		return {
			correlationId,
			error,
			hasFailed,
			hasSucceeded,
			initialize,
			logger,
			noBreakingSpaces,
			notImplementedError,
			success,
			allowRememberMe,
			authenticated,
			disabled,
			display,
			features,
			isLoggedIn,
			rememberMe,
			serviceAuth,
			signInGoogle
		};
	}
};
</script>

<style>
#federatedSignIn {
	width: 100%;
}
#google button {
	width: 250px;
}
#google button span {
	padding-top: 13px;
	padding-left: 26px;
	padding-bottom: 12px;
	font-size: 18px;
	font-family: Roboto, sans-serif;
}
</style>
