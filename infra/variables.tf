variable "image_repo_api" {
  description = "Repositorio de la imagen de la API en GHCR (sin tag)"
  type        = string
  default     = "ghcr.io/genacanas/ingsoft3-tp01-backend"
}

variable "image_repo_front" {
  description = "Repositorio de la imagen del frontend en GHCR (sin tag)"
  type        = string
  default     = "ghcr.io/genacanas/ingsoft3-tp01-frontend"
}

variable "image_tag" {
  description = "Tag de la imagen inmutable del TP7"
  type        = string
  default     = "sha-5aa06e58fbd468df87576cf941f4340dc00b0704"
}

variable "region" {
  description = "Región de despliegue en Render"
  type        = string
  default     = "oregon"
}
