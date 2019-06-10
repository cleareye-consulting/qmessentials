@extends('layouts/app')

@section('title','Products')

@section('content')
    <div class="container">
        <h2 class="subtitle">Products</h2>  
        @can('write-products')
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
            @foreach($products as $product) 
                <tr>
                    <td><a href="/products/{{$product->id}}/edit">{{$product->product_name}}</a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <div>
            <a href="/products/create">Add a Product</a>
        </div>
        @endcan
        @cannot('write-products')
        <p class="lead">You must be in role 'Analyst' to view or edit products.</p>
        @endcannot
    </div>
@endsection