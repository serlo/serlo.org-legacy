FROM serlo-org-node
COPY --from=serlo-org-workspace /usr/src/app/packages/private/markdown packages/private/markdown
COPY --from=serlo-org-workspace /usr/src/app/packages/public/legacy-editor-renderer packages/public/editor-renderer
COPY --from=serlo-org-workspace /usr/src/app/node_modules node_modules
WORKDIR packages/public/editor-renderer
ENTRYPOINT ["node", "."]
EXPOSE 3000
