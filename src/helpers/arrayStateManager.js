
export const arrayDeleteOne = (array,index) => {
    array.splice(index, 1);
    return array;
  };

  export const arrayAddOne = (array, item) => {
    array.push(item);
    return array;
  };