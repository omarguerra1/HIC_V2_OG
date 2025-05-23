import PropTypes from 'prop-types';
const steps = [
  'Receta recibida',
  'Medicamentos preparados',
  'En espera de pago',
  'Pago recibido',
  'Preparando',
  'Lista',
  'Entregada',
];
export default function ProgressBarOrder({ currentStep }) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const completed = i <= currentStep;
        return (
          <div key={i} className="flex-1">
            <div
              className={`w-8 h-8 mx-auto rounded-full 
                ${completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                flex items-center justify-center`}
            >
              {i + 1}
            </div>
            <p
              className={`text-xs mt-2 text-center 
                ${completed ? 'text-blue-600' : 'text-gray-500'}`}
            >
              {label}
            </p>
            {i < steps.length - 1 && (
              <div
                className={`h-1 bg-${completed ? 'blue-600' : 'gray-200'} 
                  mx-auto w-full mt-1`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
ProgressBarOrder.propTypes = {
  currentStep: PropTypes.number.isRequired,
};