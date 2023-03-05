"use strict";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);
const createElem = (elem) => document.createElement(elem);

const storageValue = $(".storage-value");
const transferValue = $(".transfer-value");
const storageRange = $(".storage-range");
const transferRange = $(".transfer-range");
const chartItems = $(".charts");

const state = {
  storageRangeValue: 0,
  transferRangeValue: 0,
  data: providerData,
};
const providerDataArray = state.data;

function createElementsControl(companyName, providerProps) {
  const providerRow = createElem("div");
  const providerName = createElem("p");
  const priceBar = createElem("div"); // The element that is responsible for the width of the bar
  const price = createElem("div");
  const optionsWrapper = createElem("div");

  providerName.textContent = companyName.split(".")[0];
  providerRow.className = "chart";
  optionsWrapper.className = "options-wrapper";

  price.dataset.price = companyName;

  priceBar.className = "column";
  priceBar.dataset.priceBar = companyName;

  optionsWrapper.appendChild(providerName);
  providerRow.appendChild(optionsWrapper);
  providerRow.appendChild(priceBar);
  providerRow.appendChild(price);
  createElementsControlOptions(
    providerProps.options,
    companyName,
    optionsWrapper
  );

  return providerRow;
}
function createElementsControlOptions(
  dataOptions,
  companyName,
  optionsWrapper
) {
  if (dataOptions) {
    dataOptions.forEach((option) => {
      const radio = createElem("input");
      const label = createElem("label");
      const span = createElem("span");

      radio.type = "radio";
      radio.name = companyName;
      radio.className = "radio-options";
      span.textContent = option.name;
      radio.checked = "checked";

      label.appendChild(radio);
      label.appendChild(span);

      optionsWrapper.appendChild(label);
    });
  }
}

function moduleInitialization () {
  Object.keys(providerDataArray).forEach((companyName) => {
    const providerProps = providerDataArray[companyName];
    const wrapper = createElementsControl(companyName, providerProps);

    chartItems.appendChild(wrapper);
  });
}

// RENDER ALL
moduleInitialization();
updatePrice(state);

$$(".input-range").forEach(function (input) {
  input.addEventListener("input", function () {
    const { rangeType } = this.dataset;

    if (rangeType === "storage") {
      state.storageRangeValue = this.value;
    }

    if (rangeType === "transfer") {
      state.transferRangeValue = this.value;
    }

    updatePrice(state);
  });
});

function getActiveOptionNameByCompanyName(companyName) {
  const inputElement = $(`input[type='radio'][name='${companyName}']:checked`);

  return inputElement.parentElement.querySelector("span").textContent;
}

// Updates price & priceBar width
function updatePrice({ storageRangeValue, transferRangeValue }) {
  storageValue.textContent = storageRangeValue;
  transferValue.textContent = transferRangeValue;

  Object.keys(providerDataArray).forEach((companyName) => {
    const providerProps = providerDataArray[companyName];

    const { minPayment, maxPayment, storage, transfers, options } =
      providerProps || {};

    let price = 0;

    if (options) {
      const activeOptionName = getActiveOptionNameByCompanyName(companyName);

      const activeOption = options.find(
        (option) => option.name === activeOptionName
      );

      const { transfers, storage } = activeOption || {};

      price = calculatePrice({
        storageRangeValue,
        transferRangeValue,
        storage,
        transfers,
        minPayment,
        maxPayment,
      });
    } else {
      price = calculatePrice({
        storageRangeValue,
        transferRangeValue,
        storage,
        transfers,
        minPayment,
        maxPayment,
      });
    }

    const priceElement = $(`[data-price='${companyName}']`);
    priceElement.textContent = price.toFixed(2) + "$";

    // CHANGE PRICE BAR WIDTH

    const priceBarElement = $(`[data-price-bar='${companyName}']`);
    priceBarElement.style.width = `${price * 5}px`;
  });
}

function calculatePrice({
  storageRangeValue,
  transferRangeValue,
  storage,
  transfers,
  minPayment,
  maxPayment,
}) {
  const { free: storageFree, payment: storagePayment } = storage || {};
  const { free: transfersFree, payment: transfersPayment } = transfers || {};

  let price = 0;

  price += storageRangeValue * storagePayment;
  if (storageFree) {
    price -= storageFree * storagePayment;
  }

  price += transferRangeValue * transfersPayment;
  if (transfersFree) {
    price -= transfersFree * transfersPayment;
  }

  if (price < 0) {
    price = 0;
  }

  if (minPayment && price < minPayment) {
    price = minPayment;
  }

  if (maxPayment && price > maxPayment) {
    price = maxPayment;
  }

  return price;
}

$$("label").forEach((radio) => {
  radio.addEventListener("click", () => {
    updatePrice(state);
  });
});
