from jinja2 import Environment, FileSystemLoader, select_autoescape

def get_prompt_template(dir: str, path: str):
    env = Environment(loader=FileSystemLoader(dir), autoescape=select_autoescape())
    return env.get_template(path)