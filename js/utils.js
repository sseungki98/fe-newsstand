import { isDark, subscribedPress } from "./store/store.js";
import { getState } from "./observer/observer.js";

let presses;

const getJSON = async url => {
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
  } catch (err) {
    console.error("Error : ", err);
    return null;
  }
};

function setDisplay(element, type, display) {
  //display = ['none' , 'block', 'flex']
  switch (type) {
    case "id":
      document.getElementById(element).style.display = display;
      break;
    case "query":
      document.querySelector(element).style.display = display;
      break;
  }
}

function removeDisplay() {
  setDisplay(".press-list-section", "query", "none");
  setDisplay(".press-grid", "query", "none");
  setDisplay(".no-sub-item-div", "query", "none");
}

function findPress(type, target) {
  if (type === "src") {
    let $target_src = target.getElementsByTagName("img")[0].src;
    $target_src = ".." + $target_src.split("5500")[1];
    console.log($target_src);
    const press_name = presses.find(press => {
      const press_src = getState(isDark) ? press.path_dark : press.path_light;
      return $target_src === press_src;
    }).name;
    return press_name;
  } else if (type === "name") {
    console.log(target.textContent);
    return presses.find(press => press.name === target.textContent); // 객체반환
  }
}

function findSpanNearby(element) {
  var parentElement = element.parentNode;

  // 최대 5단계까지 부모 요소를 탐색하여 <span> 태그를 찾음
  var maxDepth = 5;
  var depth = 0;

  while (parentElement && depth < maxDepth) {
    var spanElement = parentElement.querySelector("span");

    if (spanElement) {
      return spanElement;
    }

    parentElement = parentElement.parentNode;
    depth++;
  }

  return null; // 근처에 <span> 태그가 없을 경우 null 반환
}

/*
  src, name에 따라 요소 있는지 확인
*/
function checkIsSubscribe(type, target) {
  const subscribed_presses = getState(subscribedPress);
  if (type === "src") {
    return subscribed_presses.find(data => (target === getState(isDark) ? data.path_dark : data.path_light));
  } else if (type === "name") {
    let rt;
    try {
      rt = subscribed_presses.find(data => data.name === target);
    } catch (e) {
      return undefined;
    }
    return rt;
  }
}

async function initUtilData() {
  presses = await getJSON("../assets/media.json");
  presses = Object.values(presses).reduce((acc, cur) => {
    return acc.concat(cur);
  });
}

export { setDisplay, removeDisplay, findPress, findSpanNearby, getJSON, initUtilData, checkIsSubscribe };
