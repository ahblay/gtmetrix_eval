// Determines whether an input valid using the Javascript Validation API.
// Returns an error message string for invalid inputs.
var hasError = function(field) {
    if (field.type === "submit" || field.type === "button" || field.type === "reset") return;

    if (field.type === "checkbox") {
        checkboxes = document.getElementsByName("reference");
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) return;
        }
        return "Please select at least one option.";
    }

    if (field.id == "password-confirm") {
        var pwd = field.form.querySelector("#password").value;
        if (field.value != pwd) return "Your passwords do not match.";
    }

    var validity = field.validity;

    if (validity.valid) return;

    if (validity.valueMissing) {
        if (field.type === "checkbox" || field.type === "radio") {
            return "Please select an option."
        }
        if (field.type === "textarea") {
            if (field.parentNode.style.display == "inline-block") {
                return "Please explain.";
            } else {
                return;
            }
        }
        else {
            return "Please fill out this field.";
        }
    }

    if (validity.typeMismatch) {
        if (field.type === "email") {;
            return "Please enter a valid email address.";
        }
        else {
            return "Please enter the correct input type.";
        }
    }

    if (validity.patternMismatch) {
        if (field.hasAttribute("title")) {
            return field.getAttribute("title");
        }
        return "Please use the correct format.";
    }

    return "Something went wrong. Please try again.";
};

// Displays an error message below an invalid field.
var showError = function(field, error) {
    field.classList.add("error");

    if ((field.type === 'radio' && field.name) || (field.type === 'checkbox' && field.name)) {
        var group = document.getElementsByName(field.name);
        if (group.length > 0) {
            for (var i = 0; i < group.length; i++) {
                if (group[i].form !== field.form) continue;
                group[i].classList.add('error');
            }
            field = group[group.length - 1];
        }
    }

    var id = field.id || field.name;
    if (!id) return;

    var message = field.form.querySelector('.error-message#error-for-' + id );
    if (!message) {
        message = document.createElement('div');
        message.className = 'error-message';
        message.id = 'error-for-' + id;

        var label;
        if (field.type === 'radio' || field.type ==='checkbox') {
            label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;
            if (label) {
                label.parentNode.insertBefore( message, label.nextSibling );
            }
        }

        if (!label) {
            field.parentNode.insertBefore( message, field.nextSibling );
        }
    }

    message.innerHTML = error;

    message.style.display = 'block';
    message.style.visibility = 'visible';

};

// Removes an error message from an invalid field.
var removeError = function(field) {
    field.classList.remove('error');

    if ((field.type === 'radio' && field.name) || (field.type === 'checkbox' && field.name)) {
        var group = document.getElementsByName(field.name);
        if (group.length > 0) {
            for (var i = 0; i < group.length; i++) {
                if (group[i].form !== field.form) continue;
                group[i].classList.remove('error');
            }
            field = group[group.length - 1];
        }
    }

    var id = field.id || field.name;
    if (!id) return;

    var message = field.form.querySelector('.error-message#error-for-' + id + '');
    if (!message) return;

    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';
};

// Disables HTML5 form validation.
var form = document.getElementById("signup");
form.setAttribute("novalidate", true);

// Validates input on "blur" event.
document.addEventListener("blur", function(event) {
    if (event.target.form.id != "signup") return;

    var error = hasError(event.target);

    if (error) {
        showError(event.target, error);
        return
    }

    removeError(event.target);

}, true);

// Validates entire form on submit.
document.addEventListener("submit", function(event) {
    if (event.target.id != "signup") return;
    var fields = event.target.elements;

    var error, hasErrors;
    for (var i = 0; i < fields.length; i++) {
        error = hasError(fields[i]);
        if (error) {
            showError(fields[i], error);
            if (!hasErrors) {
                hasErrors = fields[i];
            }
        }
    }

    if (hasErrors) {
        event.preventDefault();
        hasErrors.focus();
    } else {
        event.preventDefault();

        name = document.getElementById("name").value;
        renderGreeting(name);

        event.target.reset();
    }

}, false);

// Renders a greeting element.
function renderGreeting(name) {
    var greeting = document.getElementsByClassName("greeting")[0];
    var form_header = document.getElementsByClassName("form-header")[0];
    if (!greeting) {
        greeting = document.createElement("div");
        greeting.className = "greeting";
        form_header.parentNode.insertBefore(greeting, form_header.nextSibling);
    }
    greeting.style.display = "block";
    greeting.innerHTML = "Thanks for signing up, " + name + "!";
}

// Shows the textarea field when "Other" option is selected.
function showTextarea() {
    var other_div = document.getElementsByClassName("other-explain")[0]
    if (other_div.style.display == "inline-block") {
        other_div.style.display = "none";
    } else {
        other_div.style.display = "inline-block";
    }
}

// Resets the signup form.
function resetForm() {
    form = document.getElementById("signup");
    form.reset();
    document.getElementsByClassName("greeting")[0].style.display = "none";
}
