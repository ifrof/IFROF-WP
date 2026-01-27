import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { v4 as uuidv4 } from "uuid";

// Placeholder for cloud storage integration (S3, Azure Blob, etc.)
// This can be extended with actual cloud storage implementation

const uploadImageSchema = z.object({
  filename: z.string(),
  mimetype: z.string(),
  size: z.number(),
  base64Data: z.string(),
  uploadType: z.enum(["profile", "product", "certification", "blog"]),
});

export const storageRouter = router({
  // Upload image
  uploadImage: protectedProcedure
    .input(uploadImageSchema)
    .mutation(async ({ ctx, input }) => {
      // Validate file size (max 5MB)
      if (input.size > 5 * 1024 * 1024) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File size exceeds 5MB limit",
        });
      }

      // Validate MIME type
      const allowedMimes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedMimes.includes(input.mimetype)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed",
        });
      }

      try {
        // Generate unique filename
        const ext = input.filename.split(".").pop();
        const uniqueFilename = `${input.uploadType}/${ctx.user.id}/${uuidv4()}.${ext}`;

        // TODO: Implement actual cloud storage upload
        // For now, return a placeholder URL
        const imageUrl = `/uploads/${uniqueFilename}`;

        return {
          success: true,
          url: imageUrl,
          filename: uniqueFilename,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload image",
        });
      }
    }),

  // Delete image
  deleteImage: protectedProcedure
    .input(z.object({ filename: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // TODO: Implement actual cloud storage deletion
        // For now, just return success
        return {
          success: true,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete image",
        });
      }
    }),

  // Get upload URL for direct upload
  getUploadUrl: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        mimetype: z.string(),
        uploadType: z.enum(["profile", "product", "certification", "blog"]),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        // TODO: Generate pre-signed URL for cloud storage
        // For now, return a placeholder
        const ext = input.filename.split(".").pop();
        const uniqueFilename = `${input.uploadType}/${ctx.user.id}/${uuidv4()}.${ext}`;

        return {
          uploadUrl: `/api/upload`,
          filename: uniqueFilename,
          headers: {
            "Content-Type": input.mimetype,
          },
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate upload URL",
        });
      }
    }),

  // Batch upload images
  uploadBatch: protectedProcedure
    .input(
      z.object({
        files: z.array(
          z.object({
            filename: z.string(),
            mimetype: z.string(),
            size: z.number(),
            base64Data: z.string(),
          })
        ),
        uploadType: z.enum(["profile", "product", "certification", "blog"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const results = [];

      for (const file of input.files) {
        try {
          // Validate file size
          if (file.size > 5 * 1024 * 1024) {
            results.push({
              filename: file.filename,
              success: false,
              error: "File size exceeds 5MB limit",
            });
            continue;
          }

          // Validate MIME type
          const allowedMimes = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ];
          if (!allowedMimes.includes(file.mimetype)) {
            results.push({
              filename: file.filename,
              success: false,
              error: "Invalid file type",
            });
            continue;
          }

          // Generate unique filename
          const ext = file.filename.split(".").pop();
          const uniqueFilename = `${input.uploadType}/${ctx.user.id}/${uuidv4()}.${ext}`;
          const imageUrl = `/uploads/${uniqueFilename}`;

          results.push({
            filename: file.filename,
            success: true,
            url: imageUrl,
          });
        } catch (error) {
          results.push({
            filename: file.filename,
            success: false,
            error: "Upload failed",
          });
        }
      }

      return {
        results,
        successCount: results.filter(r => r.success).length,
        failureCount: results.filter(r => !r.success).length,
      };
    }),
});
