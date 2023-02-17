// import 'datejs';


export const parseDateString = (date) => {

    const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1).toString() : '0' + (date.getMonth() + 1).toString()

    return (
      '' + date.getDate() + '/' + month + '/' + date.getFullYear()
    );
  };
  
  export const parseTimeString = (date) => {

    const hours = date.getHours() > 9 ? date.getHours().toString() : '0' + date.getHours().toString()
    const minutes = date.getMinutes() > 9 ? date.getMinutes().toString() : '0' + date.getMinutes().toString()

    return hours +':' + minutes
  };