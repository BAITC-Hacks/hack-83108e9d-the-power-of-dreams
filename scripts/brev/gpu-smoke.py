"""A small real CUDA computation, not an inference service or benchmark."""
import json
import torch

if not torch.cuda.is_available():
    raise RuntimeError("CUDA GPU is unavailable")

with torch.inference_mode():
    matrix = torch.ones((256, 256), device="cuda", dtype=torch.float32)
    result = matrix @ matrix
    torch.cuda.synchronize()
    if not bool(torch.all(result == 256).item()):
        raise RuntimeError("GPU matrix multiplication returned an unexpected result")

print(json.dumps({
    "status": "passed",
    "mode": "live",
    "device": torch.cuda.get_device_name(0),
    "torch": torch.__version__,
    "cuda_runtime": torch.version.cuda,
    "operation": "256x256 matrix multiplication",
    "result_value": result[0, 0].item(),
}))
