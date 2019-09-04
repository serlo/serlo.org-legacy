FROM serlo-org-node
COPY --from=serlo-org-workspace /usr/src/app/packages/private/editor-helpers packages/private/editor-helpers
COPY --from=serlo-org-workspace /usr/src/app/packages/private/edtr-io packages/private/edtr-io
COPY --from=serlo-org-workspace /usr/src/app/packages/private/legacy-editor-to-editor packages/private/legacy-editor-to-editor
COPY --from=serlo-org-workspace /usr/src/app/packages/private/markdown packages/private/markdown
COPY --from=serlo-org-workspace /usr/src/app/packages/private/mathjax packages/private/mathjax
COPY --from=serlo-org-workspace /usr/src/app/packages/public/editor-renderer packages/public/editor-renderer
COPY --from=serlo-org-workspace /usr/src/app/node_modules node_modules
WORKDIR packages/public/editor-renderer
ENTRYPOINT ["node", "."]
EXPOSE 3000
