from fastapi import APIRouter
from app.evaluation.benchmark import EvaluationPipeline
from app.schemas import EvaluationResultSchema

router = APIRouter(prefix="/api/evaluation", tags=["evaluation"])

@router.get("", response_model=EvaluationResultSchema)
def get_evaluation_metrics():
    pipeline = EvaluationPipeline()
    return pipeline.run_benchmark()
