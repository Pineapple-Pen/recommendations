// merge sort array of objects on specific key

const quickSort = (array, key, left, right) => {
  if (left >= right) {
    return;
  }
  let pivot = Math.floor((left + right) / 2);
  let index = rotateValuesAroundPivot(array, key, left, right, pivot);
  quickSort(array, key, left, index - 1);
  quickSort(array, key, index, right);
}

const rotateValuesAroundPivot = (array, key, left, right, pivot) => {
  while (left <= right) {
    while (array[left][key] > array[pivot][key]) {
      left += 1;
    }

    while (array[right][key] < array[pivot][key]) {
      right -= 1;
    }

    if (array[left][key] <= array[right][key]) {
      // SWAP THEM
      [array[left], array[right]] = [array[right], array[left]];
      left += 1;
      right -= 1;
    }
  }

  return left;
};

module.exports = quickSort;
