.PHONY: run test
.DEFAULT_GOAL: run

default: run

run:  ## Run apigateway on port 8080
	@docker-compose build 	.apigateway
	@docker-compose up run.apigateway

test: ## Run the current test suite
	@docker-compose build test.apigateway
	@docker-compose run --rm test.apigateway