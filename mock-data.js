//This structure will allow flexible scaling of this module

const providerData = {
  "backblaze.com": {
    minPayment: 7,
    storage: { free: 0, payment: 0.005 },
    transfers: { free: 0, payment: 0.01 },
  },

  "bunny.net": {
    maxPayment: 10,
    options: [
      {
        name: "HDD",
        storage: { free: 0, payment: 0.01 },
        transfers: { free: 0, payment: 0.01 },
      },
      {
        name: "SDD",
        storage: { free: 0, payment: 0.02 },
        transfers: { free: 0, payment: 0.01 },
      },
    ],
  },

  "scaleway.net": {
    options: [
      {
        name: "multi",
        storage: { free: 75, payment: 0.06 },
        transfers: { free: 75, payment: 0.02 },
      },
      {
        name: "single",
        storage: { free: 75, payment: 0.03 },
        transfers: { free: 75, payment: 0.02 },
      },
    ],
  },

  "vultr.com": {
    minPayment: 5,
    storage: { free: 0, payment: 0.01 },
    transfers: { free: 0, payment: 0.01 },
  },
};
