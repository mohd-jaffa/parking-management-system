const PARKING_RATES = {
    bike:  { base: 10, perHour: 5  },
    car:   { base: 20, perHour: 10 },
    truck: { base: 30, perHour: 15 },
}

function calculateParkingFee(vehicleType, entryTime, exitTime) {
    const durationInMs = exitTime - entryTime;
    const durationInHours = Math.ceil(durationInMs / (1000 * 60 * 60));
    const rate = PARKING_RATES[vehicleType];
    if (!rate) return 0;
    let amount = rate.base;
    if (durationInHours > 1) {
        amount += (durationInHours - 1) * rate.perHour;
    }
    return amount;
};

module.exports = { calculateParkingFee };