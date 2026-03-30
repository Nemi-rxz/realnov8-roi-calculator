import PropTypes from 'prop-types'

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  prefix,
  suffix,
  type,
  inputMode,
  min,
  max,
  step,
  helperText,
  required,
  disabled,
}) {
  const hasPrefix = Boolean(prefix)
  const hasSuffix = Boolean(suffix)

  return (
    <label className="input-field">
      <span className="section-label">{label}</span>
      <span className="input-shell">
        {hasPrefix ? <span className="input-affix input-affix-prefix">{prefix}</span> : null}
        <input
          className="editorial-input"
          disabled={disabled}
          inputMode={inputMode}
          max={max}
          min={min}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          step={step}
          type={type}
          value={value}
        />
        {hasSuffix ? <span className="input-affix input-affix-suffix">{suffix}</span> : null}
      </span>
      {helperText ? <span className="input-helper">{helperText}</span> : null}
    </label>
  )
}

InputField.propTypes = {
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  inputMode: PropTypes.string,
  label: PropTypes.string.isRequired,
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  prefix: PropTypes.string,
  required: PropTypes.bool,
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  suffix: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

InputField.defaultProps = {
  disabled: false,
  helperText: '',
  inputMode: 'decimal',
  max: undefined,
  min: undefined,
  onChange: undefined,
  placeholder: '',
  prefix: '',
  required: false,
  step: undefined,
  suffix: '',
  type: 'text',
  value: '',
}

export default InputField
