 export const shirtWorkflow = {
    "9": {
      "inputs": {
        "coat": false,
        "jacket": false,
        "cardigan": false,
        "vest": false,
        "sweater": false,
        "hood": false,
        "shirt, blouse": false,
        "top, t-shirt, sweatshirt": true,
        "sleeve": true,
        "dress": false,
        "jumpsuit": false,
        "cape": false,
        "pants": false,
        "shorts": false,
        "skirt": false,
        "tights, stockings": false,
        "sock": false,
        "shoe": false,
        "process_res": 512,
        "mask_blur": 0,
        "mask_offset": 0,
        "background_color": "Alpha",
        "invert_output": false,
        "images": [
          "17",
          0
        ],
        "accessories_options": [
          "12",
          0
        ]
      },
      "class_type": "FashionSegmentClothing",
      "_meta": {
        "title": "Fashion Segment (RMBG)"
      }
    },
    "12": {
      "inputs": {
        "hat": false,
        "glasses": false,
        "headband, head covering, hair accessory": false,
        "scarf": false,
        "tie": false,
        "glove": false,
        "watch": false,
        "belt": false,
        "leg warmer": false,
        "bag, wallet": false,
        "umbrella": false,
        "collar": false,
        "lapel": false,
        "neckline": false,
        "epaulette": false,
        "pocket": false,
        "buckle": false,
        "zipper": false,
        "applique": false,
        "bow": false,
        "flower": false,
        "bead": false,
        "fringe": false,
        "ribbon": false,
        "rivet": false,
        "ruffle": false,
        "sequin": false,
        "tassel": false
      },
      "class_type": "FashionSegmentAccessories",
      "_meta": {
        "title": "Accessories Segment (RMBG)"
      }
    },
    "15": {
      "inputs": {
        "format": "PNG",
        "images": [
          "9",
          0
        ]
      },
      "class_type": "ETN_SendImageWebSocket",
      "_meta": {
        "title": "Send Image (WebSocket)"
      }
    },
    "17": {
      "inputs": {
        "image": ""
      },
      "class_type": "ETN_LoadImageBase64",
      "_meta": {
        "title": "Load Image (Base64)"
      }
    }
  };

  export const shirtWorkflow2 = {
    "9": {
      "inputs": {
        "coat": false,
        "jacket": false,
        "cardigan": false,
        "vest": false,
        "sweater": false,
        "hood": false,
        "shirt, blouse": false,
        "top, t-shirt, sweatshirt": true,
        "sleeve": true,
        "dress": false,
        "jumpsuit": false,
        "cape": false,
        "pants": false,
        "shorts": false,
        "skirt": false,
        "tights, stockings": false,
        "sock": false,
        "shoe": false,
        "process_res": 512,
        "mask_blur": 0,
        "mask_offset": 0,
        "background_color": "Alpha",
        "invert_output": false,
        "images": [
          "23",
          0
        ],
        "accessories_options": [
          "12",
          0
        ]
      },
      "class_type": "FashionSegmentClothing",
      "_meta": {
        "title": "Fashion Segment (RMBG)"
      }
    },
    "12": {
      "inputs": {
        "hat": false,
        "glasses": false,
        "headband, head covering, hair accessory": false,
        "scarf": false,
        "tie": false,
        "glove": false,
        "watch": false,
        "belt": false,
        "leg warmer": false,
        "bag, wallet": false,
        "umbrella": false,
        "collar": false,
        "lapel": false,
        "neckline": false,
        "epaulette": false,
        "pocket": false,
        "buckle": false,
        "zipper": false,
        "applique": false,
        "bow": false,
        "flower": false,
        "bead": false,
        "fringe": false,
        "ribbon": false,
        "rivet": false,
        "ruffle": false,
        "sequin": false,
        "tassel": false
      },
      "class_type": "FashionSegmentAccessories",
      "_meta": {
        "title": "Accessories Segment (RMBG)"
      }
    },
    "15": {
      "inputs": {
        "format": "PNG",
        "images": [
          "9",
          0
        ]
      },
      "class_type": "ETN_SendImageWebSocket",
      "_meta": {
        "title": "Send Image (WebSocket)"
      }
    },
    "23": {
      "inputs": {
        "image": "IMG_3305.jpg"
      },
      "class_type": "LoadImage",
      "_meta": {
        "title": "Load Image"
      }
    },
    
    "27": {
      "inputs": {
        "images": [
          "9",
          0
        ]
      },
      "class_type": "SaveImageWebsocket",
      "_meta": {
        "title": "SaveImageWebsocket"
      }
    },
    "28": {
      "inputs": {
        "filename_prefix": "ComfyUI",
        "images": [
          "9",
          0
        ]
      },
      "class_type": "SaveImage",
      "_meta": {
        "title": "Save Image"
      }
    }
  };