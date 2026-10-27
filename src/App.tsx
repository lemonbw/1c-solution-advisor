import { useState } from "react";
import { questions } from "./data/questions";
import { engine } from "./engine/recommendation";
import { RecommendationResult } from "./types";
import { configs } from "./data/configs";

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const visibleQuestions = questions.filter(q => {
    if (!q.showIf) return true;
    return q.showIf(answers);
  });

  const currentQuestion = visibleQuestions[currentStep];

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < visibleQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const res = engine.calculate(answers);
      setResult(res);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  const isAnswered = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === "text") {
      return answers[currentQuestion.id] !== undefined && answers[currentQuestion.id] !== "";
    }
    if (currentQuestion.type === "single") {
      return answers[currentQuestion.id] !== undefined;
    }
    if (currentQuestion.type === "multiple") {
      const val = answers[currentQuestion.id];
      return Array.isArray(val) && val.length > 0;
    }
    return false;
  };

  if (result) {
    return (
      <div className="container">
        <div className="card">
          <h1>Результат подбора</h1>
          <p style={{ color: result.insufficientData ? "#856404" : "#28a745" }}>
            {result.insufficientData ? "⚠ Предварительный результат" : "✓ Рекомендация готова"}
          </p>
          
          {result.explanation && (
            <div className="alert alert-info">
              <strong>Основная рекомендация:</strong> {result.explanation}
            </div>
          )}
          
          {result.needsCombination && result.combinationReason && (
            <div className="alert alert-info">
              <strong>Комбинация конфигураций:</strong> {result.combinationReason}
            </div>
          )}
          
          <h2>Рекомендуемые решения</h2>
          {result.primary.map(score => {
            const config = configs.find((c: any) => c.id === score.configId);
            if (!config) return null;
            return (
              <div key={score.configId} style={{ marginBottom: "20px", padding: "15px", border: "2px solid #0066cc", borderRadius: "4px" }}>
                <h3 style={{ margin: "0 0 10px 0", color: "#0066cc" }}>{config.name}</h3>
                <p><strong>Описание:</strong> {config.fullDescription}</p>
                <p><strong>Бизнес-задачи:</strong> {config.businessTasks.join(", ")}</p>
                <p><strong>Ключевые возможности:</strong> {config.keyFeatures.join(", ")}</p>
                <p><strong>Ограничения:</strong> {config.limitations.join(", ")}</p>
                <p><strong>Внутренняя оценка алгоритма:</strong> {score.score} баллов (уверенность: {score.confidence}%)</p>
                {score.reasons.length > 0 && (
                  <div>
                    <strong>Почему подходит:</strong>
                    <ul>
                      {score.reasons.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
          
          {result.dataGaps.length > 0 && (
            <div className="alert alert-warning">
              <strong>Что уточнить:</strong>
              <ul>
                {result.dataGaps.map((g, i) => <li key={i}>{g}</li>)}
              </ul>
            </div>
          )}
          
          {result.toClarify.length > 0 && (
            <div>
              <strong>Рекомендации для уточнения:</strong>
              <ul>
                {result.toClarify.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )}
          
          <div style={{ marginTop: "30px" }}>
            <button onClick={handleReset}>Начать новую консультацию</button>
            <button className="secondary" onClick={() => window.print()}>Распечатать отчёт</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>1С Solution Advisor</h1>
        <p>Подбор конфигураций 1С для клиентов в Казахстане</p>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: ((currentStep + 1) / visibleQuestions.length) * 100 + "%" }}
          />
        </div>
        <p>Вопрос {currentStep + 1} из {visibleQuestions.length}</p>
        
        {currentQuestion && (
          <>
            <h2>{currentQuestion.text}</h2>
            <p style={{ color: "#666", fontSize: "14px" }}>{currentQuestion.block}</p>
            
            {currentQuestion.type === "single" && currentQuestion.options && (
              <div className="radio-group">
                {currentQuestion.options.map(option => (
                  <label key={option.value} className="radio-item">
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option.value}
                      checked={answers[currentQuestion.id] === option.value}
                      onChange={() => handleAnswer(currentQuestion.id, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
            
            {currentQuestion.type === "multiple" && currentQuestion.options && (
              <div className="checkbox-group">
                {currentQuestion.options.map(option => (
                  <label key={option.value} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={(answers[currentQuestion.id] || []).includes(option.value)}
                      onChange={(e) => {
                        const current = answers[currentQuestion.id] || [];
                        if (e.target.checked) {
                          handleAnswer(currentQuestion.id, [...current, option.value]);
                        } else {
                          handleAnswer(currentQuestion.id, current.filter((v: string) => v !== option.value));
                        }
                      }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            )}
            
            {currentQuestion.type === "text" && (
              <input
                type="text"
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                placeholder="Введите ответ"
              />
            )}
            
            <div style={{ marginTop: "30px" }}>
              <button onClick={handleBack} disabled={currentStep === 0} className="secondary">
                Назад
              </button>
              <button onClick={handleNext} disabled={!isAnswered() && currentQuestion.required && !currentQuestion.skipable}>
                {currentStep === visibleQuestions.length - 1 ? "Получить результат" : "Далее"}
              </button>
              <button onClick={handleReset} className="secondary">Сбросить анкету</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
