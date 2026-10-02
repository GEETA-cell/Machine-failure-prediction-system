
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os

app = FastAPI(
    title="Machinery Failure Prediction API",
    version="1.0.0"
)

# ============================================================
# MODEL PATH
# ============================================================

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "machinery_failure_model.pkl"
)


# ============================================================
# LOAD TRAINED MODEL
# ============================================================

try:
    model_data = joblib.load(MODEL_PATH)

    if isinstance(model_data, dict):

        model = model_data["model"]

        threshold = float(
            model_data.get("threshold", 0.35)
        )

        features = model_data["features"]

    else:

        model = model_data

        threshold = 0.5

        features = [
            "Type",
            "Air temperature [K]",
            "Process temperature [K]",
            "Rotational speed [rpm]",
            "Torque [Nm]",
            "Tool wear [min]"
        ]

    MODEL_LOADED = True

except Exception as e:

    model = None
    threshold = 0.35

    features = [
        "Type",
        "Air temperature [K]",
        "Process temperature [K]",
        "Rotational speed [rpm]",
        "Torque [Nm]",
        "Tool wear [min]"
    ]

    MODEL_LOADED = False

    print("Model loading failed:", e)


# ============================================================
# REQUEST MODEL
# ============================================================

class PredictionInput(BaseModel):

    type: str

    air_temperature: float

    process_temperature: float

    rotational_speed: float

    torque: float

    tool_wear: float

    # --------------------------------------------------------
    # Testing switch
    #
    # False = normal application
    # True  = intentionally introduce logical error
    # --------------------------------------------------------

    simulate_logical_error: bool = False


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "service": "Machinery Failure Prediction API",
        "status": "running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "ok",
        "model_loaded": MODEL_LOADED,
        "threshold": threshold
    }


# ============================================================
# PREDICTION
# ============================================================

@app.post("/predict")
def predict(data: PredictionInput):

    try:

        # ====================================================
        # CHECK MODEL
        # ====================================================

        if model is None:

            raise HTTPException(
                status_code=503,
                detail="Machine learning model is not available"
            )


        # ====================================================
        # BASIC INPUT VALIDATION
        # ====================================================

        if data.air_temperature < 0:

            raise ValueError(
                "Air temperature cannot be negative"
            )

        if data.process_temperature < 0:

            raise ValueError(
                "Process temperature cannot be negative"
            )

        if data.rotational_speed < 0:

            raise ValueError(
                "Rotational speed cannot be negative"
            )

        if data.torque < 0:

            raise ValueError(
                "Torque cannot be negative"
            )

        if data.tool_wear < 0:

            raise ValueError(
                "Tool wear cannot be negative"
            )


        # ====================================================
        # NORMAL INPUT
        # ====================================================

        if not data.simulate_logical_error:

            input_data = pd.DataFrame([{

                "Type": data.type,

                "Air temperature [K]":
                    data.air_temperature,

                "Process temperature [K]":
                    data.process_temperature,

                "Rotational speed [rpm]":
                    data.rotational_speed,

                "Torque [Nm]":
                    data.torque,

                "Tool wear [min]":
                    data.tool_wear
            }])


        # ====================================================
        # INTENTIONAL LOGICAL ERROR
        # ====================================================
        #
        # The following section looks completely valid.
        #
        # However, sensor values are mapped incorrectly.
        #
        # Air temperature      -> Process temperature
        # Process temperature  -> Air temperature
        # Rotational speed     -> Torque
        # Torque               -> Rotational speed
        #
        # The program still runs because all values are numeric.
        # The model therefore receives VALID DATA with WRONG MEANING.
        #
        # This is a logical error rather than a syntax error.
        #
        # ====================================================

        else:

            input_data = pd.DataFrame([{

                "Type": data.type,

                "Air temperature [K]":
                    data.process_temperature,

                "Process temperature [K]":
                    data.air_temperature,

                "Rotational speed [rpm]":
                    data.torque,

                "Torque [Nm]":
                    data.rotational_speed,

                "Tool wear [min]":
                    data.tool_wear
            }])


        # ====================================================
        # ENSURE TRAINING FEATURE ORDER
        # ====================================================

        input_data = input_data[features]


        # ====================================================
        # MODEL PREDICTION
        # ====================================================

        probability = float(
            model.predict_proba(input_data)[0][1]
        )


        # ====================================================
        # INTENTIONAL LOGICAL ERROR #2
        # ====================================================
        #
        # Normal:
        #
        # probability >= threshold
        #
        # means FAILURE.
        #
        # When simulate_logical_error=True, we intentionally
        # reverse this decision.
        #
        # ====================================================

        if data.simulate_logical_error:

            prediction_value = int(
                probability <= threshold
            )

        else:

            prediction_value = int(
                probability >= threshold
            )


        # ====================================================
        # RESULT
        # ====================================================

        if prediction_value == 1:

            prediction = "FAILURE_RISK"

            recommendation = (
                "Potential machine failure detected. "
                "Inspect the machine and schedule "
                "preventive maintenance."
            )

        else:

            prediction = "NORMAL"

            recommendation = (
                "Machine appears normal. "
                "Continue monitoring sensor values."
            )


        # ====================================================
        # RESPONSE
        # ====================================================

        return {

            "prediction": prediction,

            "failure_probability": round(
                probability,
                6
            ),

            "threshold": threshold,

            "model_name": "XGBoost",

            "recommendation": recommendation,

            "logical_error_mode":
                data.simulate_logical_error
        }


    # ========================================================
    # INPUT ERROR
    # ========================================================

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=f"Invalid input: {str(e)}"
        )


    # ========================================================
    # HTTP ERROR
    # ========================================================

    except HTTPException:

        raise


    # ========================================================
    # UNKNOWN ERROR
    # ========================================================

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction service failed: {str(e)}"
        )

