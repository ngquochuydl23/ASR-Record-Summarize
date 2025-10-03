def apply_paginate(page, limit):
    offset = (page - 1) * limit
    return offset, limit