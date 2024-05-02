<template>
	<index-card index-class="ma-auto align-self-center pa-5" width="90vw">
		<v-card-title class="w-100">
			<v-row class="w-100 mb-5">
				<v-spacer />
				<v-col v-for="(header, index) of totalHeaders" :key="index" cols="2">
					<v-card class="rounded-lg">
						<v-layout column class="pa-3">
							<v-avatar :color="header.color" size="60" />

							<div>{{ header.label }}</div>

							<div>{{ $data[header.value] }}</div>
						</v-layout>
					</v-card>
				</v-col>
				<v-spacer />
			</v-row>
		</v-card-title>

		<div class="w-100 h-100">
			<v-row>
				<v-col cols="6">
					<v-card class="rounded-lg" height="100%" width="100%">
						<v-data-table
							:headers="tableHeaders"
							:items="students"
							class="rounded-lg"
							style="height: 100%"
						>
							<template #item.student="{ item }">
								{{ item.firstName + ' ' + item.lastName }}
							</template>
						</v-data-table>
					</v-card>
				</v-col>

				<v-col cols="6" class="h-100">
					<v-card height="100%" width="100%" class="rounded-lg py-3">
						<canvas id="pieChart" />
					</v-card>
				</v-col>
			</v-row>

			<v-row class="justify-center">
				<v-col v-for="(header, index) of rowHeaders" :key="index" cols="4">
					<v-card height="100%" width="100%" class="rounded-lg py-3">
						<canvas :id="header.id"/>
					</v-card>
				</v-col>
			</v-row>
		</div>
	</index-card>
</template>

<script>
import { mapFields } from 'vuex-map-fields';
import { Chart, registerables } from "chart.js";

export default {
	name: 'AnalyticsPage',
	layout: 'post',
	data () {
		return {
			totalHeaders: [
				{
					label: "Total articles",
					value: "totalArtical",
					color: "#5BBCFF"
				},
				{
					label: "Total faculties",
					color: "#FFFAB7",
					value: "totalFaculties"
				},
				{
					label: "Total students",
					color: "#FFD1E3",
					value: "totalStudent"
				},
				{
					label: "Total contributions",
					color: "#7EA1FF",
					value: "totalContribution"
				}
			],
			tableHeaders: [
				{
					text: 'Student',
					value: 'student',
					sortable: false
				},
				{
					text: 'Number of contributions',
					value: 'contribution',
					class: 'rounded-tr-lg',
					sortable: false
				}
			],
			rowHeaders: [
				{
					id: "itChart",
					faculty: "information-technology",
					colors: ["#ED6A5A", "#F4F1BB"]
				},
				{
					id: "gdChart",
					faculty: "graphic-design",
					colors: ["#6E0D25", "#FFFFB3"]
				},
				{
					id: "bChart",
					faculty: "business",
					colors: ["#EF6461", "#E4B363"]
				},
				{
					id: "mChart",
					faculty: "marketing",
					colors: ["#F05D5E", "#0F7173"]
				},
				{
					id: "aChart",
					faculty: "accounting",
					colors: ["#335C67", "#FFF3B0"]
				}
			],
			contribution: {},
			students: [],
			totalArtical: undefined,
			totalContribution: undefined,
			totalStudent: undefined,
			totalFaculties: undefined
		};
	},
	async fetch () {
		this.contribution = await this.$getData.fetch('http://localhost:8080/contribution/count') || 0;
		this.totalArtical = this.contribution?.numOfPostPerFaculty.reduce(
			(previousValue, currentValue) =>
				previousValue + currentValue[Object.keys(currentValue)[0]].approved, 0) ||
			0;
		this.totalContribution = this.contribution.total;
		this.totalStudent = await this.$getData.fetch('http://localhost:8080/user/count') || 0;
		this.totalFaculties = await this.$getData.fetch('http://localhost:8080/faculty/count');
		this.students = await this.$getData.fetch('http://localhost:8080/contribution/count-contribution-per-user');
	},
	computed: {
		...mapFields('faculty', ['faculties'])
	},
	async mounted () {
		await this.$fetch();
		Chart.register(...registerables);
		const ctx = document.getElementById("pieChart");
		const pieChartData = {
			type: 'pie',
			data: {
				labels: [...this.contribution?.numOfPostPerFaculty.map((faculty) => Object.keys(faculty)[0])],
				datasets: [{
					backgroundColor: [
						"#d7d0c8",
						"#c8c6af",
						"#95a78d",
						"#bd897e",
						"#f87666"
					],
					data: [
						...this.contribution?.numOfPostPerFaculty.map((faculty) => faculty[Object.keys(faculty)[0]].length)
					]
				}]
			},
			options: {
				resposive: true,
				plugins: {
					title: {
						display: true,
						text: "Number of contribution per faculty"
					}
				},
				maintainAspectRatio: false
			}
		};
		// eslint-disable-next-line no-new
		new Chart(ctx, pieChartData);

		this.rowHeaders.forEach((header, index) => {
			const data = {
				type: 'pie',
				data: {
					labels: ['Posted', 'In Process'],
					datasets: [{
						backgroundColor: header.colors,
						data: [
							this.contribution?.numOfPostPerFaculty[index][header.faculty].approved,
							this.contribution?.numOfPostPerFaculty[index][header.faculty].nonApproved
						]
					}]
				},
				options: {
					resposive: true,
					plugins: {
						title: {
							display: true,
							text: "Number of posted contribution in " + this.faculties.find((faculty) => faculty.slug === header.faculty)?.name
						}
					},
					maintainAspectRatio: false
				}
			};

			const pie = document.getElementById(header.id);
			// eslint-disable-next-line no-new
			new Chart(pie, data);
		});
	}
};
</script>

<style>
.v-data-table {
	flex-direction: column;
	display: flex;

	.v-data-table__wrapper {
		flex-grow: 1;
		display: flex;

		table {
			flex-grow: 1;
		}
	}
}
</style>
