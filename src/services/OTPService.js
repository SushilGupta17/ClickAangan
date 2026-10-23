// =========================================================
// OTP SERVICE
// ClickAangan
// =========================================================

const API_URL = 'https://savariyaproperty.in/api/Login';

// =========================================================
// SEND OTP
// =========================================================

export const sendOTP = async mobile => {
  try {
    alert('aaa');

    const response = await fetch(`${API_URL}/SendOTP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: mobile,
      }),
    });

    const result = await response.json();
    
    alert(JSON.stringify(result, null, 2));

    console.log('================================');
    console.log('SEND OTP STATUS:', response.status);
    console.log('SEND OTP RESPONSE:', JSON.stringify(result, null, 2));
    console.log('================================');

    return {
      httpStatus: response.status,
      success: response.ok && result?.success === true,
      message:
        result?.message ||
        result?.Message ||
        'Unable to send OTP',
      data: result,
    };
  } catch (error) {
    console.log('SEND OTP ERROR:', error);

    return {
      httpStatus: 0,
      success: false,
      message: 'Unable to connect to server',
      error: error,
    };
  }
};


// =========================================================
// VERIFY OTP
// =========================================================

export const verifyOTP = async (mobile, otp) => {
  try {
  

    const response = await fetch(`${API_URL}/VerifyOTP`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: mobile,
        OTP: otp,
      }),
    });

    const result = await response.json();

    console.log('================================');
    console.log('VERIFY OTP STATUS:', response.status);
    console.log(
      'VERIFY OTP RESPONSE:',
      JSON.stringify(result, null, 2),
    );
    console.log('================================');

    return {
      httpStatus: response.status,
      success: response.ok && result?.success === true,
      message:
        result?.message ||
        result?.Message ||
        'Invalid or expired OTP',
      data: result,
    };
  } catch (error) {
    console.log('VERIFY OTP ERROR:', error);

    return {
      httpStatus: 0,
      success: false,
      message: 'Unable to connect to server',
      error: error,
    };
  }
};