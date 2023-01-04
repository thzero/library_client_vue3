<template>
	<div
		class="text-center"
	>
		<v-card>
			<v-card-title>
				{{ $t('titles.openSource') }}
			</v-card-title>
			<v-card-text
				class="pt-2"
			>
				<v-row
				>
					<v-col
						xs12
						lg6
						mb-1
						:pr-2="$vuetify.display.lgAndUp"
					>
						<v-table
							fixed-header
							style="width: 100%;"
						>
							<thead>
								<tr>
									<th class="text-center" colspan="2">
										{{ $t('openSource.client') }}
									</th>
								</tr>
								<tr>
									<th class="text-left">
										{{ $t('openSource.resource') }}
									</th>
									<th class="text-left">
										{{ $t('openSource.license') }}
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(item2, jndex) in dependenciesClient"
									:key="key(jndex, 'b')"
								>
									<td class="text-left">
										<a
											v-if="item2.url"
											class="opensource-padding"
											:href="item2.url"
										>
											{{ item2.name }}
										</a>
										<span
											v-if="!item2.url"
											class="opensource-padding"
										>
											{{ item2.name }}
										</span>
									</td>
									<td class="text-left">
										<a
											v-if="item2.licenseUrl"
											class="opensource-padding"
											:href="item2.licenseUrl"
										>
											{{ item2.licenseName }}
										</a>
										<span
											v-if="!item2.licenseUrl"
											class="opensource-padding"
										>
											{{ item2.licenseName }}
										</span>
									</td>
								</tr>
							</tbody>
						</v-table>
					</v-col>
					<v-col
						xs12
						lg6
						mb-1
						:pl-2="$vuetify.display.lgAndUp"
					>
						<v-table
							fixed-header
							style="width: 100%;"
						>
							<template #default>
								<thead>
									<tr>
										<th class="text-center" colspan="2">
											{{ $t('openSource.server') }}
										</th>
									</tr>
									<tr>
										<th class="text-left">
											{{ $t('openSource.resource') }}
										</th>
										<th class="text-left">
											{{ $t('openSource.license') }}
										</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(item2, jndex) in dependenciesServer"
										:key="key(jndex, 'b')"
									>
										<td class="text-left">
											<a
												v-if="item2.url"
												class="opensource-padding"
												:href="item2.url"
											>
												{{ item2.name }}
											</a>
											<span
												v-if="!item2.url"
												class="opensource-padding"
											>
												{{ item2.name }}
											</span>
										</td>
										<td class="text-left">
											<a
												v-if="item2.licenseUrl"
												class="opensource-padding"
												:href="item2.licenseUrl"
											>
												{{ item2.licenseName }}
											</a>
											<span
												v-if="!item2.licenseUrl"
												class="opensource-padding"
											>
												{{ item2.licenseName }}
											</span>
										</td>
									</tr>
								</tbody>
							</template>
						</v-table>
					</v-col>
				</v-row>
			</v-card-text>
		</v-card>
	</div>
</template>

<style scoped>
	.opensource-padding {
		padding-left: 16px
	}
</style>
