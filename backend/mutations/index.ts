import { graphQLSchemaExtension } from "@keystone-6/core";
import { gql } from 'graphql-tag';
import addToCart from "./addToCart";
import checkout from './checkout';


const graphql = String.raw;

export const extendGraphqlSchema = graphQLSchemaExtension({

    typeDefs: graphql`
    
        type Mutation {
            addToCart(productId: ID): wb_cart_item,
            checkout(token: String!): wb_order
        }
    
    `,
    resolvers: {
        Mutation: {
            addToCart,
            checkout,
        }
    }


});