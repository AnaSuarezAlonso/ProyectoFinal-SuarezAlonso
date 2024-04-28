let user = {}

let form = document.getElementById('form')

//Create the event
form.addEventListener('submit', (e)=>{
    
  // Form validation
  const isValid = formValidation(e);

  if (!isValid) {
      e.preventDefault();
  } else {
    setTimeout(()=>{
      Swal.fire({
        title: "Su compra ha sido realizada con éxito",
        text: `Será enviada a nombre de ${user.name} ${user.surname} a la dirección ${user.direction}.`,
        icon: "success",
        iconColor: '#D9AB9A',
        confirmButtonColor: '#D9AB9A',
        customClass: {
            title:'sweetAlertTitle',
            text: 'sweetAlertText'
        }
      }) 
    }, 250)
      emptyCart()
      closeOrder()
  }
})

function formValidation(e) {
    e.preventDefault()
    const userName = document.querySelector('#userName').value
    const surname = document.querySelector('#surname').value
    const direction = document.querySelector('#direction').value
    const phoneNumber = document.querySelector('#phoneNumber').value
    const mail = document.querySelector('#mail').value

    let isValid = true

    //UserName, surname and direction required validation
    if (!userName) {
      displayError('#userName', 'El nombre es obligatorio.')
      isValid = false
    } else {
      clearError('#userName')
    }

    if (!surname) {
        displayError('#surname', 'Los apellidos son obligatorios.')
        isValid = false;
    } else {
        clearError('#surname')
    }

    if (!direction) {
        displayError('#direction', 'La dirección es obligatoria.')
        isValid = false
    } else {
        clearError('#direction')
    }

    // Email format and required validation
    if (!mail) {
      displayError('#mail', 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!validateEmail(mail)) {
        displayError('#mail', 'Por favor ingrese un correo electrónico válido.');
        isValid = false;
    } else {
        clearError('#mail');
    }

    // Phone validation
    const phoneRegex = /^(\+?\d+)$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
        displayError('#phoneNumber', 'El teléfono debe contener solo números.');
        isValid = false;
    } else {
        clearError('#phoneNumber');
    }

    if (isValid) {
      user.name = userName
      user.surname = surname
      user.direction = direction
      user.phoneNumber = phoneNumber
      user.mail = mail
    }

    return isValid
}

// Display errors function
function displayError(selector, message) {
  const input = document.querySelector(selector);
  let errorSpan = input.nextElementSibling;

  if (!errorSpan || !errorSpan.classList.contains('error-message')) {
      errorSpan = document.createElement('span');
      errorSpan.classList.add('error-message');
      input.parentNode.appendChild(errorSpan);
  }
  errorSpan.textContent = message;
}

// Clear error messages
function clearError(selector) {
  const input = document.querySelector(selector);
  const errorSpan = input.nextElementSibling;

  if (errorSpan && errorSpan.classList.contains('error-message')) {
      errorSpan.textContent = '';
  }
}

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}