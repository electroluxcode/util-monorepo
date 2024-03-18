type MonitoringData = {
	createBy: null;
	createTime: null;
	updateBy: null;
	updateTime: null;
	remark: string | null;
	id: number;
	projectId: string | null;
	equipmentName: string;
	divisionalEngineering: string;
	subEngineering: string;
	installationTime: null;
	holeDepth: null;
	monitoringNum: string | null;
	initialData: null;
	initialTemper: null;
	instrumentNumber: string;
	probeNumber: string | null;
	sensitivity: null;
	temperatureCorrectionFactor: null;
	temperatureCompensationFactor: string | null;
	alpha: string | null;
	monitoringTime: string;
	monitoringData: number | null;
	unit: string;
	monitoringTemper: number | null;
	monitoringDataChageRate: number | null;
	monitoringValue: number | null;
	monitoringValueType: string;
	subareaName: string | null;
	holeBaseElevation: string | null;
	depth: null;
	startTime: null;
	endTime: null;
};

type TransformedData = {
	YData: number[][];
	XData: string[];
	TitleData: string[];
};

const transformData = (inputData: Record<string, MonitoringData[]>) => {
	const YData: number[][] = [];
	const XData: string[] = [];
	const TitleData: string[] = [];

	for (const key in inputData) {
		// if()

		let monitoringDataList = inputData[key];
		monitoringDataList = monitoringDataList.sort(
			(a, b) =>
				new Date(a.monitoringTime).getTime() -
				new Date(b.monitoringTime).getTime()
		);
		const tempYData: number[] = [];

		monitoringDataList.forEach((data) => {
			const date = new Date(data.monitoringTime);
			const formattedDate = `${date.getFullYear()}-${
				date.getMonth() + 1
			}-${date.getDate()}`;
			if (!XData.includes(formattedDate)) {
				XData.push(formattedDate);
			}

			tempYData[XData.indexOf(formattedDate)] = data.monitoringValue ?? 0;
		});

		YData.push(tempYData);
		TitleData.push(key);
	}

	return { YData, XData, TitleData } as TransformedData;
};

// Example usage
const inputData = {
	DD004084: [
		// ... (data for DD004084)
	],
	"测试MQTT>key1": [
		// ... (data for 测试MQTT>key1)
	],
	// Add more data entries as needed
};

const temp = transformData(inputData);
console.log(temp);
