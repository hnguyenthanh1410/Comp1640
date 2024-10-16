<template>
	<index-card index-class="ma-auto align-self-center pa-5" width="90vw">
		<v-card-title class="w-100 d-flex flex-column">
			<div class="text-h5 text-lg-h3">
				Analytics Page
			</div>
			<date-picker v-model="dates" :current-date="currentDate" @submit="$fetch" />
		</v-card-title>

		<div class="w-100 h-100">
			<v-row class="align-center d-flex">
				<v-col ref="left" cols="6">
					<v-card class="rounded-lg" width="100%">
						<v-data-table
							:headers="tableHeaders"
							:items="students"
							class="rounded-lg"
						>
							<template #item.student="{ item }">
								{{ item.firstName + ' ' + item.lastName }}
							</template>
						</v-data-table>
					</v-card>
				</v-col>

				<v-col ref="right" cols="6" class="h-100">
					<v-row>
						<v-card width="100%" class="rounded-lg py-3 mb-1">
							<canvas id="pieChart" />
						</v-card>
					</v-row>

					<v-row>
						<v-card width="100%" class="rounded-lg py-3 mt-1">
							<canvas id="totalChart" />
						</v-card>
					</v-row>
				</v-col>
			</v-row>

			<v-row class="justify-center">
				<v-tabs v-model="activeTab" vertical>
					<v-tab v-for="(header, index) of rowHeaders" :key="index">
						{{ header.text }}
					</v-tab>

					<v-tabs-items v-model="activeTab">
						<v-tab-item v-for="(header, index) of rowHeaders" :key="index" :eager="true" class="h-100">
							<canvas :id="header.id" />
						</v-tab-item>
					</v-tabs-items>
				</v-tabs>
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
			activeTab: 0,
			dates: {
				from: '',
				to: ''
			},
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
					colors: ["#ED6A5A", "#F4F1BB"],
					text: "Information Technology"
				},
				{
					id: "gdChart",
					faculty: "graphic-design",
					colors: ["#6E0D25", "#FFFFB3"],
					text: "Graphic Design"
				},
				{
					id: "bChart",
					faculty: "business",
					colors: ["#EF6461", "#E4B363"],
					text: "Business"
				},
				{
					id: "mChart",
					faculty: "marketing",
					colors: ["#F05D5E", "#0F7173"],
					text: "Marketing"
				},
				{
					id: "aChart",
					faculty: "accounting",
					colors: ["#335C67", "#FFF3B0"],
					text: "Accounting"
				}
			],
			contribution: {},
			students: [],
			totalArtical: undefined,
			totalContribution: undefined,
			totalFaculties: undefined,
			mounted: false,
			charts: []
		};
	},
	async fetch () {
		if (!this.mounted) {
			const currentDate = [
				new Date().getFullYear(),
				(new Date().getMonth() + 1).toString().padStart(2, "0"),
				new Date().getDate().toString().padStart(2, "0")
			];

			this.dates.from = currentDate[0] + '-01' + '-01';
			this.dates.to = currentDate.join('-');
			this.mounted = true;
		} else {
			this.updateChart();
		}

		this.contribution = await this.$getData.fetch('http://localhost:8080/contribution/count', this.dates, 'post') || 0;
		this.totalArtical = this.contribution.total.artical;
		this.totalContribution = this.contribution.total.length;
		this.students = await this.$getData.fetch('http://localhost:8080/contribution/count-contribution-per-user', this.dates, 'post');
	},
	computed: {
		...mapFields('faculty', ['faculties']),
		currentDate () {
			const currentDate = [
				new Date().getFullYear(),
				(new Date().getMonth() + 1).toString().padStart(2, "0"),
				new Date().getDate().toString().padStart(2, "0")
			];

			return currentDate.join('-');
		}
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
		this.charts.push(new Chart(ctx, pieChartData));

		const labels = [];

		this.totalArtical.forEach((date) => {
			const key = Object.keys(date)[0];
			if (
				!labels.length ||
				labels.find((d) => d !== key)
			) {
				labels.push(key);
			}
		});

		this.totalContribution.forEach((date) => {
			const key = Object.keys(date)[0];
			
			if (
				!labels.length ||
				!labels.find((d) => d === key)
			) {
				labels.push(key);
			}
		});

		const lineChartConfig = {
			type: 'line',
			data: {
				labels,
				datasets: [
					{
						label: 'Total Contribution',
						data: this.returnData(this.totalContribution),
						backgroundColor: "#7EA1FF",
						borderColor: "#7EA1FF",
						yAxisID: 'y'
					},
					{
						label: 'Total Artical',
						data: this.returnData(this.totalArtical),
						backgroundColor: "#5BBCFF",
						borderColor: "#5BBCFF",
						yAxisID: 'y'
					}
				]
			},
			options: {
				resposive: true,
				plugins: {
					title: {
						display: true,
						text: "Total Contribution and Artical"
					}
				},
				scales: {
					y: {
						type: 'linear',
						display: true,
						position: 'left',
						min: 0,
						suggestedMax: 35,
						ticks: {
							stepSize: 5
						}
					}
				}
			}
		};
		const chart = document.getElementById("totalChart");

		this.charts.push(new Chart(chart, lineChartConfig));

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
			this.charts.push(new Chart(pie, data));
		});
	},
	methods: {
		returnData (data) {
			return data.map((header) => {
				const key = Object.keys(header)[0];
				
				return {
					x: key,
					y: header[key]
				};
			});
		},
		loadChart () {
			const faculty = this.rowHeaders[this.activeTab].faculty;

			const data = {
				type: 'pie',
				data: {
					labels: ['Posted', 'In Process'],
					datasets: [{
						backgroundColor: this.rowHeaders[this.activeTab].colors,
						data: [
							this.contribution?.numOfPostPerFaculty[this.activeTab][faculty].approved,
							this.contribution?.numOfPostPerFaculty[this.activeTab][faculty].nonApproved
						]
					}]
				},
				options: {
					resposive: true,
					plugins: {
						title: {
							display: true,
							text: "Number of posted contribution in " + this.faculties.find((faculty) => faculty.slug === faculty)?.name
						}
					}
				}
			};

			const pie = document.getElementById(this.rowHeaders[this.activeTab].id);
			console.log(pie);
			
			// eslint-disable-next-line no-new
			new Chart(pie, data);
		},
		updateChart () {
			console.log(this.charts);
			
			this.charts.forEach((chart) => {
				if (chart.options.plugins.title.text === "Total Contribution and Artical") chart.data.labels = [];
				chart.data.datasets.forEach((dataset) => {
					dataset.data = [];
				});
				chart.update();
			});
		}
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
