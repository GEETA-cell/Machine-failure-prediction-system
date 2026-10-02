import { useEffect, useState } from "react";
import { getMachines, predict } from "../services/api";

export default function Predict() {
  const [machines, setMachines] = useState([]);
  const [result, setResult] = useState(null);

  const [form, setForm] = useState({
    machine_id: "",
    type: "M",
    air_temperature: "",
    process_temperature: "",
    rotational_speed: "",
    torque: "",
    tool_wear: "",
  });

  useEffect(() => {
    getMachines()
      .then((res) => setMachines(res.data))
      .catch((err) => console.error(err));
  }, []);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      setResult(null);

      const payload = {
        machine_id: Number(form.machine_id),
        type: form.type,
        air_temperature: Number(form.air_temperature),
        process_temperature: Number(form.process_temperature),
        rotational_speed: Number(form.rotational_speed),
        torque: Number(form.torque),
        tool_wear: Number(form.tool_wear),
      };

      const response = await predict(payload);

      console.log("Prediction response:", response.data);

      // IMPORTANT:
      // Backend response = { reading, prediction }
      // We only store the prediction object.
      setResult(response.data.prediction);

    } catch (error) {
      console.error("Prediction error:", error);
      alert("Prediction failed. Check the backend and ML API.");
    }
  };

  return (
    <main>
      <div className="hero">
        <p className="eyebrow">MODEL INTEGRATION</p>

        <h1>Run Failure Prediction</h1>

        <p>
          Enter the sensor values and predict whether the machine is
          likely to fail.
        </p>
      </div>

      <section id="predict">
        <form onSubmit={submit}>

          <label>
            Machine

            <select
              name="machine_id"
              value={form.machine_id}
              onChange={change}
              required
            >
              <option value="">Select machine</option>

              {machines.map((machine) => (
                <option value={machine.id} key={machine.id}>
                  {machine.machine_code} — {machine.machine_name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Machine Type

            <select
              name="type"
              value={form.type}
              onChange={change}
              required
            >
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="H">H</option>
            </select>
          </label>

          <label>
            Air Temperature [K]

            <input
              type="number"
              step="any"
              name="air_temperature"
              value={form.air_temperature}
              onChange={change}
              required
            />
          </label>

          <label>
            Process Temperature [K]

            <input
              type="number"
              step="any"
              name="process_temperature"
              value={form.process_temperature}
              onChange={change}
              required
            />
          </label>

          <label>
            Rotational Speed [rpm]

            <input
              type="number"
              step="any"
              name="rotational_speed"
              value={form.rotational_speed}
              onChange={change}
              required
            />
          </label>

          <label>
            Torque [Nm]

            <input
              type="number"
              step="any"
              name="torque"
              value={form.torque}
              onChange={change}
              required
            />
          </label>

          <label>
            Tool Wear [min]

            <input
              type="number"
              step="any"
              name="tool_wear"
              value={form.tool_wear}
              onChange={change}
              required
            />
          </label>

          <button type="submit">
            Predict Failure
          </button>

        </form>

        {result && (
          <div
            className={
              result.prediction === "NORMAL"
                ? "result good"
                : "result bad"
            }
          >
            <h2>{result.prediction}</h2>

            <p>
              Failure Probability:{" "}
              {(Number(result.failure_probability) * 100).toFixed(2)}%
            </p>

            <p>
              Threshold: {Number(result.threshold)}
            </p>

            <p>
              Model: {result.model_name}
            </p>

            <p>
              {result.recommendation}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}