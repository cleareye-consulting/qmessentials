@extends('layouts/app')

@section('title','Lots')

@section('content')
    <div class="container">
        <h2 class="subtitle">Lots</h2>  
        @can('write-lot')
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Created</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
            @foreach($lots as $lot) 
                <tr>
                    <td><a href="/lots/{{$lot->id}}/edit">{{$lot->lot_number}}</a></td>
                    <td>{{$lot->product->product_name}}</td>
                    <td>{{$lot->customer_name}}</td>
                    <td>{{$lot->created_at}}</td>
                    <td>{{$lot->lot_status}}</td>
                </tr>
            @endforeach
            </tbody>
        </table>
        <div>
            <a href="/lots/create">Add a Lot</a>
        </div>
        @endcan
        @cannot('write-lot')
        <p class="lead">You must be in role 'Lead Person' to view or edit lots and items.</p>
        @endcannot
    </div>
@endsection