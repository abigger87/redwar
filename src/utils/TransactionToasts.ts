import { toast } from 'react-toastify';

// ** Callback for Transaction Submission **
const onTxSubmitted = async (msg='๐ Transaction Submitted ๐ ') => {
  toast(msg, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// ** Callback for Transaction Failed **
const onTxFailed = async (msg='โ Transaction Failed โ') => {
  toast.error(msg, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// ** User Rejection Callback **
const userRejectedCallback = async (msg='โ Transaction Rejected โ') => {
  toast.warn(msg, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// ** Callback for Transaction Confirmation **
const onTxConfirmed = async (msg=`๐ฐ Minting Successfull๐ฐ`) => {
  // ** Then, let's toast **
  toast.success(msg, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export {
  onTxSubmitted,
  onTxFailed,
  userRejectedCallback,
  onTxConfirmed
};