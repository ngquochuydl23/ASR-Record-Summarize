import torch

def check_gpu():
    available = torch.cuda.is_available()
    if not available:
        return {
        "available": available,
        "number of GPUs": 0,
        "GPU name": None
    }
    return {
        "available": available,
        "number of GPUs": torch.cuda.device_count(),
        "GPU name": torch.cuda.get_device_name(0)
    }