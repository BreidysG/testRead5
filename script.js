document.addEventListener('DOMContentLoaded', function() {
    const titleInit = document.getElementById("titleInit");
    const paragraphInit = document.getElementById("paragraphInit");
    const startButton = document.getElementById('startButton');
    const textContainer = document.getElementById('textContainer');
    const finishButton = document.getElementById('finishButton');
    const questionnaire = document.getElementById('questionnaire');
    const quizForm = document.getElementById('quizForm');
    const results = document.getElementById('results');
    const timerValue = document.getElementById('timerValue');
    let time = [];

    let wordCount = 0;
    let startTime, endTime;
    let quizCompleted = false;
    let timerInterval;

    // Texto para las preguntas del cuestionario
    const questions = [
        { 
            question: "¿Quién dice la frase, La última galletita de la lata?", 
            answers: ["La mamá del narrador", "Los hermanos del narrador", "La abuela del narrador", "La tía del narrador"], 
            correctAnswer: "La abuela del narrador" 
        },
        { 
            question: "¿Qué significa la frase, La última galletita de la lata?", 
            answers: ["No hay más que comer", "Al comerse esta galletita, ya no hay más hasta dentro de un mes", "Las personas que parecían olvidadas o que no se les prestaba atención", "Que debe compartir la galletita con el resto de la familia"], 
            correctAnswer: "Las personas que parecían olvidadas o que no se les prestaba atención" 
        },
        { 
            question: "Después de comerse la última galletita de la lata, ¿cómo se sintió el protagonista?", 
            answers: ["Triste", "Como decía la abuela, olvidado", "Satisfecho", "Con hambre"], 
            correctAnswer: "Como decía la abuela, olvidado" 
        },
        { 
            question: "¿Qué le explicó la mamá sobre el significado de la frase de la abuela?", 
            answers: ["Que era cierta", "Que no era tan cierta", "Todos los hijos son valorados por igual, todos son amados, todos son importantes", "Que hay hijos más consentidos que otros y más amados que otros"], 
            correctAnswer: "Todos los hijos son valorados por igual, todos son amados, todos son importantes" 
        },
        { 
            question: "¿Qué pasó con la lata de galletitas desde ese día?", 
            answers: ["Nunca más quedó una sola", "No volvieron a comprar galletitas", "La arrojaron a la basura", "Todas las respuestas son correctas"], 
            correctAnswer: "Nunca más quedó una sola" 
        }
    ];
              
    function countWords(text) {
        return text.split(/\s+/).length;
        // Función para contar las palabras en el texto
    }
    // Función para calcular la velocidad de lectura (palabras por minuto)
    function calculateReadingSpeed(startTime, endTime, wordCount) {

        const minutes = (endTime - startTime) / 60000; // Convertir a minutos
        return Math.round(wordCount / minutes);
    }
    // Función para calcular el tiempo por palabra en milisegundos
    function calculateTimePerWord(ppm) {

        return Math.round(60000 / ppm); // ms por palabra
    }
    // Función para mostrar las preguntas del cuestionario
    function displayQuestions() {

        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';
        
        questions.forEach((question, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p>${question.question}</p>
                <div class="question-options">
                    ${question.answers.map((answer, i) => `
                        <label>
                            <input type="radio" name="answer${index}" value="${answer}">
                            ${answer}
                        </label>
                    `).join('')}
                </div>
            `;
            questionList.appendChild(listItem);
        });
    }

    // Evento para comenzar el test al hacer clic en "Empezar"
    startButton.addEventListener('click', function() {
        textContainer.classList.remove('hidden');
        paragraphInit.classList.add("hidden");
        startButton.classList.add('hidden');
        startTime = Date.now();
        // Iniciar el contador
        timerInterval = setInterval(updateTimer, 1000);
    });

    // Función para actualizar el contador de tiempo
    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo transcurrido en segundos
        timerValue.textContent = currentTime;
        time.push(currentTime);
    }

    // Evento para finalizar el test al hacer clic en "Terminar Test"
    finishButton.addEventListener('click', function() {
        clearInterval(timerInterval); // Detener el contador
        titleInit.classList.add("hidden");
        textContainer.classList.add('hidden');
        finishButton.classList.add('hidden');
        endTime = Date.now();
        wordCount = countWords(document.getElementById('textToRead').textContent);
        const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount);
        questionnaire.classList.remove('hidden');
        displayQuestions();
    });

    // Evento para enviar el cuestionario
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!quizCompleted) {
            let anyAnswerSelected = true;

            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (!selectedAnswer) {
                    anyAnswerSelected = false;
                    return;
                }
            });

            if (!anyAnswerSelected) {
                alert("Debes seleccionar una opción para cada pregunta antes de terminar.");
                return;
            }

            let correctAnswers = 0;
            let totalQuestions = questions.length;

            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                    correctAnswers++;
                }
            });

            let comprehensionPercentage = (correctAnswers / totalQuestions) * 100;
            let timeResult = time[time.length-1];

            const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount); // Usar la velocidad de lectura real
            const timePerWordInMs = calculateTimePerWord(readingSpeed); // Ajustar el tiempo por palabra basado en la velocidad de lectura real
            
            quizCompleted = true;
            results.classList.remove('hidden');
            questionnaire.classList.add('hidden');
            document.getElementById('wordCountValue').textContent = wordCount;
            document.getElementById('readingSpeedValue').textContent = `${readingSpeed} palabras por minuto`;
            document.getElementById('comprehensionValue').textContent = `${comprehensionPercentage}`;
            document.getElementById('timeResultValue').textContent = `${timeResult} segundos`;

            // Mostrar tiempo por palabra ajustado
            document.getElementById('results').innerHTML += `
                <p class="lastParagrah">Toma nota de tu velocidad de lectura para poder realizar ajustes en los próximos ejercicios.</p>
                <p class="finalMessage">Puedes salir y pasar a la siguiente clase.</p>
                <p>Ajusta esta velocidad en tus ejercicios: ${timePerWordInMs} milisegundos por palabra</p>
            `;
        }
    });
});

