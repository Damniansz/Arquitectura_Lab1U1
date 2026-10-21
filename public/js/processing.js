(function () {
  "use strict";

  const forms = document.querySelectorAll("form[data-loading]");
  const modalElement = document.getElementById("processing-modal");
  const title = document.getElementById("processing-title");
  const description = document.getElementById("processing-description");
  const status = document.getElementById("processing-status");

  const modal =
    modalElement && window.bootstrap
      ? new bootstrap.Modal(modalElement, {
          backdrop: "static",
          keyboard: false
        })
      : null;

  const originalButtons = new Map();
  let submitting = false;
  let lastSubmitter = null;

  forms.forEach(function (form) {
    form.querySelectorAll('button[type="submit"]').forEach(function (button) {
      originalButtons.set(button, {
        html: button.innerHTML,
        disabled: button.disabled
      });
    });

    form.addEventListener("submit", function (event) {
      if (submitting) {
        event.preventDefault();
        return;
      }

      if (!form.checkValidity()) {
        event.preventDefault();
        form.reportValidity();
        return;
      }

      submitting = true;
      lastSubmitter =
        event.submitter || form.querySelector('button[type="submit"]');

      form.setAttribute("aria-busy", "true");

      const message = form.dataset.loading || "Procesando solicitud…";
      const isTraining =
        new URL(form.action, window.location.href).pathname === "/train";

      if (title) {
        title.textContent = message;
      }

      if (description) {
        description.textContent = isTraining
          ? "Se están procesando los datos, entrenando el modelo y calculando las métricas."
          : "Se están procesando los valores ingresados con el modelo entrenado.";
      }

      if (status) {
        status.textContent = message;
      }

      originalButtons.forEach(function (_, button) {
        button.disabled = true;
      });

      if (lastSubmitter) {
        const spinner = document.createElement("span");
        spinner.className = "spinner-border spinner-border-sm me-2";
        spinner.setAttribute("aria-hidden", "true");

        lastSubmitter.replaceChildren(
          spinner,
          document.createTextNode(message)
        );
      }

      if (modal) {
        modal.show();
      }

      // Se conserva el envío normal del formulario a Flask.
      // La respuesta del servidor carga la página con resultados o errores.
    });
  });

  // Restaura la interfaz si el navegador recupera la página
  // desde su caché al utilizar Atrás o Adelante.
  window.addEventListener("pageshow", function (event) {
    if (!event.persisted) {
      return;
    }

    submitting = false;

    forms.forEach(function (form) {
      form.removeAttribute("aria-busy");
    });

    originalButtons.forEach(function (original, button) {
      button.innerHTML = original.html;
      button.disabled = original.disabled;
    });

    if (status) {
      status.textContent = "";
    }

    if (modal) {
      modal.hide();
    }

    if (lastSubmitter && !lastSubmitter.disabled) {
      lastSubmitter.focus();
    }
  });
  // Ocultar una predicción anterior cuando cambian sus datos de entrada.
const predictionForm = document.querySelector(
  'form[aria-describedby="prediction-help"]'
);

if (predictionForm) {
  predictionForm.addEventListener("input", function () {
    const section = predictionForm.closest("section");
    const previousResult = section.querySelector(
      ".wm-prediction-result"
    );

    if (previousResult) {
      previousResult.hidden = true;
    }
  });
}
})();