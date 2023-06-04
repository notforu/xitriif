import torch
from peft import PeftModel, PeftConfig
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig, BitsAndBytesConfig

MODEL_NAME = "IlyaGusev/llama_7b_ru_turbo_alpaca_lora"

quantization_config = BitsAndBytesConfig(llm_int8_enable_fp32_cpu_offload=True)

config = PeftConfig.from_pretrained(MODEL_NAME)
model = AutoModelForCausalLM.from_pretrained(
    config.base_model_name_or_path,
    load_in_8bit=True,
    torch_dtype=torch.float32,
    device_map="auto",
    offload_folder="./offload",
    quantization_config=quantization_config,
)
model = PeftModel.from_pretrained(model, MODEL_NAME, torch_dtype=torch.float32, offload_folder="./offload")
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, torch_dtype=torch.float32, offload_folder="./offload")
model.eval()

generation_config = GenerationConfig.from_pretrained(MODEL_NAME)
data = tokenizer(["### Задание: Почему трава зеленая?\n### Ответ: "], return_tensors="pt")
data = {k: v.to(model.device) for k, v in data.items() if k in ("input_ids", "attention_mask")}
output_ids = model.generate(**data, generation_config=generation_config)[0]
print(tokenizer.decode(output_ids, skip_special_tokens=True))
