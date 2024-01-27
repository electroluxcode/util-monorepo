const transformData = (inputData) => {
    const YData = [];
    const XData = [];
    const TitleData = [];
    for (const key in inputData) {
        // if()
        let monitoringDataList = inputData[key];
        monitoringDataList = monitoringDataList.sort((a, b) => new Date(a.monitoringTime).getTime() -
            new Date(b.monitoringTime).getTime());
        const tempYData = [];
        monitoringDataList.forEach((data) => {
            const date = new Date(data.monitoringTime);
            const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            if (!XData.includes(formattedDate)) {
                XData.push(formattedDate);
            }
            tempYData[XData.indexOf(formattedDate)] = data.monitoringValue ?? 0;
        });
        YData.push(tempYData);
        TitleData.push(key);
    }
    return { YData, XData, TitleData };
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
