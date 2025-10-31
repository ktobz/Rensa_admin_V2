on:
    push:
      branches: [ "testing"]
    workflow_dispatch:
  
env:
    AZURE_WEBAPP_NAME: rensa-admin-test    # set this to your application's name
    AZURE_WEBAPP_PACKAGE_PATH: '.'      # set this to the path to your web app project, defaults to the repository root
    NODE_VERSION: '22.x'                # set this to the node version to use
  
permissions:
    contents: read
  
jobs:
    build:
      runs-on: ubuntu-latest
      steps:
      - uses: actions/checkout@v4
  
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'yarn'
  
      - name: npm install, build, and test
        run: |
          yarn install
          yarn run build
  
      - name: Upload artifact for deployment job
        uses: actions/upload-artifact@v4
        with:
          name: node-app
          path: .
  
    # deploy:
    #   permissions:
    #     contents: none
    #   runs-on: ubuntu-latest
    #   needs: build
    #   environment:
    #     name: 'Development'
    #     url: ${{ steps.deploy-to-webapp.outputs.webapp-url }}
  
    #   steps:
    #   - name: Download artifact from build job
    #     uses: actions/download-artifact@v4
    #     with:
    #       name: node-app
  
    #   - name: 'Deploy to Azure WebApp'
    #     id: deploy-to-webapp
    #     uses: azure/webapps-deploy@v2
    #     with:
    #       app-name: ${{ env.AZURE_WEBAPP_NAME }}
    #       publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
    #       package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
    deploy:
    runs-on: ubuntu-latest
    needs: build
    permissions:
      id-token: write #This is required for requesting the JWT
      contents: read #This is required for actions/checkout

    steps:
      - name: Download artifact from build job
        uses: actions/download-artifact@v4
        with:
          name: node-app
      
      - name: Login to Azure
        uses: azure/login@v2
        with:
          client-id: ${{ secrets.AZUREAPPSERVICE_CLIENTID_B6246A7FEB824FFDBCC0037763288A61 }}
          tenant-id: ${{ secrets.AZUREAPPSERVICE_TENANTID_85A1EE68C1AF4351AD2F6A0C0DA4BBEF }}
          subscription-id: ${{ secrets.AZUREAPPSERVICE_SUBSCRIPTIONID_3062EACE3A454BA1A3B6CE4935EE829B }}

      - name: 'Deploy to Azure Web App'
        id: deploy-to-webapp
        uses: azure/webapps-deploy@v3
        with:
          app-name: ${{ env.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: ${{ env.AZURE_WEBAPP_PACKAGE_PATH }}
          