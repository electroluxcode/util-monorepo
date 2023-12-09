var ad;
(function (ad) {
    ad[ad["id"] = 45] = "id";
    ad[ad["TEST"] = 454] = "TEST";
})(ad || (ad = {}));
const peopleKeyType = Object.entries(ad);
console.log(peopleKeyType);
